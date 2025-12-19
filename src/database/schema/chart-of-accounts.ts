import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  bigint,
} from 'drizzle-orm/pg-core';
import { chartOfAccountTypeEnum } from './chart-of-account-type.enum';

export const chartOfAccounts = pgTable(
  'chart_of_accounts',
  {
    id: bigint('id', { mode: 'number' })
      .generatedAlwaysAsIdentity()
      .primaryKey()
      .notNull(),
    uid: uuid('uid').defaultRandom().notNull(),

    parentId: bigint('parent_id', { mode: 'number' }).references(
      () => chartOfAccounts.id,
      {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
    ),

    description: varchar('description', { length: 100 }).notNull(),

    code: varchar('code', { length: 15 }).notNull(),

    level: integer('level').notNull(),

    type: chartOfAccountTypeEnum('type').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => ({
    pk: {
      name: 'pk_chart_of_accounts',
      columns: [t.id],
    },
  }),
);
