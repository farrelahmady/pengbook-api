import { pgEnum } from 'drizzle-orm/pg-core';

export const chartOfAccountTypeEnum = pgEnum('chart_of_account_type', [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
]);
