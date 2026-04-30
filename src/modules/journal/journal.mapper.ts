import { JournalEntry, Prisma } from '@prisma/client';

type GroupByDateList = {
  date: string;
  entries: JournalEntry[];
};
export class JournalMapper {
  static toGroupByDateList(
    journals: Prisma.JournalEntryGetPayload<{
      include: { lines: { include: { account: true } } };
    }>[],
  ): GroupByDateList[] {
    const grouped: Record<string, any[]> = {};

    for (const journal of journals) {
      const date = journal.date.toISOString().split('T')[0];

      if (!grouped[date]) {
        grouped[date] = [];
      }

      const totalDebit = journal.lines.reduce(
        (s, l) => s + l.debit.toNumber(),
        0,
      );
      const totalCredit = journal.lines.reduce(
        (s, l) => s + l.credit.toNumber(),
        0,
      );

      // Is In Flow if In debit there is ASSET
      const isInFlow = journal.lines.some(
        (l) => l.account.type === 'ASSET' && l.debit.toNumber() > 0,
      );

      const amount = isInFlow
        ? Math.max(totalDebit, totalCredit)
        : -1 * Math.max(totalDebit, totalCredit);

      grouped[date].push({
        id: journal.id,
        description: journal.description,
        amount: amount,
        lines: journal.lines.map((line) => ({
          account: `${line.account.code} · ${line.account.name}`,
          debit: line.debit,
          credit: line.credit,
        })),
      });
    }

    // convert ke bentuk yang kamu mau
    return Object.entries(grouped).map(([date, entries]) => ({
      date,
      entries,
    }));
  }
}
