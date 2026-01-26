import { HttpException, Injectable } from '@nestjs/common';
import { CreateJournalDto } from './dto/create-journal.dto';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { create, all } from 'mathjs';
import * as ExcelJS from 'exceljs';
import { idrAccountingFormat } from '@/core/constants/excel-format.constant';
import { parseExcelDate } from '@/core/utils/date.util';
import { RequestContext } from '@/core/context/request-context';
import { RawJournalRow } from './dto/import-journal.dto';

@Injectable()
export class JournalService {
  constructor(
    private readonly ctx: RequestContext,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateJournalDto) {
    let math = create(all, { precision: 2 });
    const totalDebit = dto.lines.reduce((sum, l) => math.add(sum, l.debit), 0);
    const totalCredit = dto.lines.reduce(
      (sum, l) => math.add(sum, l.credit),
      0,
    );

    if (!math.equal(totalDebit, totalCredit)) {
      throw new HttpException(
        'Total debit harus sama dengan total credit',
        400,
      );
    }

    dto.lines.forEach((line, index) => {
      if (line.debit > 0 && line.credit > 0) {
        throw new HttpException(
          `Line ${index + 1}: Debit dan Credit tidak boleh diisi bersamaan`,
          400,
        );
      }

      if (line.debit === 0 && line.credit === 0) {
        throw new HttpException(
          `Line ${index + 1}: Debit atau Credit harus diisi`,
          400,
        );
      }
    });

    return this.prisma.$transaction(async (tx) => {
      return tx.journalEntry.create({
        data: {
          date: new Date(dto.date),
          description: dto.description,
          lines: {
            create: dto.lines.map((line) => ({
              accountId: line.accountId,
              debit: new Prisma.Decimal(line.debit),
              credit: new Prisma.Decimal(line.credit),
            })),
          },
        },
        include: {
          lines: {
            include: {
              account: true,
            },
          },
        },
      });
    });
  }

  async findAll() {
    return this.prisma.journalEntry.findMany({
      include: {
        lines: {
          include: {
            account: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.journalEntry.findUnique({
      where: { id },
      include: {
        lines: {
          include: {
            account: true,
          },
        },
      },
    });
  }

  async importFromExcel(buffer: Buffer) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);

    const sheet = workbook.getWorksheet('Journal');
    if (!sheet) throw new HttpException('Sheet Journal tidak ditemukan', 400);

    const rows = this.parseRows(sheet);
    const journals = this.groupRows(rows);

    return this.saveJournals(journals);
  }

  private parseRows(sheet: ExcelJS.Worksheet): RawJournalRow[] {
    const rows: RawJournalRow[] = [];

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header

      const journalDate = parseExcelDate(
        row.getCell('A').value as Date,
        this.ctx.timezone,
      );
      const description = row.getCell('B').value?.toString();
      const accountCode = row.getCell('C').value?.toString();
      const debit = Number(row.getCell('D').value ?? 0);
      const credit = Number(row.getCell('E').value ?? 0);

      if (!journalDate || !accountCode) return;

      rows.push({
        journalDate,
        description,
        accountCode,
        debit,
        credit,
      });
    });

    return rows;
  }

  private groupRows(rows: RawJournalRow[]) {
    const map = new Map<string, RawJournalRow[]>();

    for (const row of rows) {
      const key = `${row.journalDate.toISOString()}|${row.description ?? ''}`;

      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(row);
    }

    return [...map.values()];
  }

  private validateJournal(lines: RawJournalRow[]) {
    let totalDebit = 0;
    let totalCredit = 0;

    for (const l of lines) {
      if (l.debit > 0 && l.credit > 0) {
        throw new HttpException(
          `Account ${l.accountCode} tidak boleh debit dan credit bersamaan`,
          400,
        );
      }

      totalDebit += l.debit;
      totalCredit += l.credit;
    }

    if (totalDebit !== totalCredit) {
      throw new HttpException(
        'Total debit tidak sama dengan total credit',
        400,
      );
    }
  }

  private async mapAccounts(codes: string[]) {
    const accounts = await this.prisma.chartOfAccount.findMany({
      where: {
        code: { in: codes },
        isPosting: true,
      },
    });

    const map = new Map(accounts.map((a) => [a.code, a.id]));

    for (const code of codes) {
      if (!map.has(code)) {
        throw new HttpException(
          `Account code ${code} tidak ditemukan atau bukan posting`,
          400,
        );
      }
    }

    return map;
  }

  private async saveJournals(groups: RawJournalRow[][]) {
    return this.prisma.$transaction(async (tx) => {
      for (const lines of groups) {
        this.validateJournal(lines);

        const accountMap = await this.mapAccounts(
          lines.map((l) => l.accountCode),
        );

        await tx.journalEntry.create({
          data: {
            date: lines[0].journalDate,
            description: lines[0].description,
            lines: {
              create: lines.map((l) => ({
                accountId: accountMap.get(l.accountCode)!,
                debit: l.debit,
                credit: l.credit,
              })),
            },
          },
        });
      }
    });
  }

  async generateImportTemplate(): Promise<ExcelJS.Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Journal');

    sheet.columns = [
      {
        header: 'journalDate',
        key: 'journalDate',
        width: 15,
        style: { numFmt: 'yyyy-mm-dd' },
      },
      { header: 'description', key: 'description', width: 30 },
      { header: 'accountCode', key: 'accountCode', width: 20 },
      {
        header: 'debit',
        key: 'debit',
        width: 15,
        style: {
          numFmt: idrAccountingFormat,
        },
      },
      {
        header: 'credit',
        key: 'credit',
        width: 15,
        style: {
          numFmt: idrAccountingFormat,
        },
      },
    ];

    // contoh baris
    sheet.addRow({
      journalDate: new Date(),
      description: 'Kas awal',
      accountCode: '1.01.01.01',
      debit: 1000000,
      credit: 0,
    });

    // styling header (optional tapi profesional)
    sheet.getRow(1).font = { bold: true };

    return workbook.xlsx.writeBuffer();
  }
}
