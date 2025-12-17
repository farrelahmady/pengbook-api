import { sql } from 'drizzle-orm';

export async function up(db: { execute: (q: any) => Promise<any> }) {
  await db.execute(sql`
    CREATE TRIGGER trg_chart_of_accounts_updated_at
    BEFORE UPDATE ON chart_of_accounts
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  `);
}

export async function down(db: { execute: (q: any) => Promise<any> }) {
  await db.execute(sql`
    DROP TRIGGER IF EXISTS trg_chart_of_accounts_updated_at
    ON chart_of_accounts;
  `);
}
