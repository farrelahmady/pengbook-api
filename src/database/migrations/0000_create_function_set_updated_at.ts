import { sql } from 'drizzle-orm';

export async function up(db: { execute: (q: any) => Promise<any> }) {
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);
}

export async function down(db: { execute: (q: any) => Promise<any> }) {
  await db.execute(sql`
    DROP FUNCTION IF EXISTS set_updated_at;
  `);
}
