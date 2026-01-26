export interface RawJournalRow {
  journalDate: Date;
  description?: string;
  accountCode: string;
  debit: number;
  credit: number;
}
