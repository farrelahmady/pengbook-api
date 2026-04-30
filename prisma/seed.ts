import { seedCOA } from './seed/coa.seed';
import { seedJournal } from './seed/journal.seed';

async function main() {
  await seedCOA();
  await seedJournal(20);
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
