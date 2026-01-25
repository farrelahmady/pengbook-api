import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateJournalDto } from './dto/create-journal.dto';
import { PrismaService } from '@/core/database/prisma/prisma.service';

@Injectable()
export class JournalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateJournalDto) {
    const totalDebit = dto.lines.reduce((sum, l) => sum + l.debit, 0);
    const totalCredit = dto.lines.reduce((sum, l) => sum + l.credit, 0);

    if (totalDebit !== totalCredit) {
      throw new HttpException(
        'Total debit harus sama dengan total credit',
        400,
      );
    }

    return this.prisma.journalEntry.create({
      data: {
        date: new Date(dto.date),
        description: dto.description,
        lines: {
          create: dto.lines.map((line) => ({
            accountId: line.accountId,
            debit: line.debit,
            credit: line.credit,
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
}
