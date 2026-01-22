import { seedCOA } from './seed/coa.seed';

async function main() {
  await seedCOA();
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
