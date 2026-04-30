import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function generateRandomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function randomAmount(min = 1000, max = 100000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function seedJournal(count = 20) {
  // ambil account berdasarkan type
  const accounts = await prisma.chartOfAccount.findMany({
    where: {
      type: {
        in: ['ASSET', 'EXPENSE', 'REVENUE'],
      },
      isPosting: true,
    },
  });

  const assetAccounts = accounts.filter((a) => a.type === 'ASSET');
  const expenseAccounts = accounts.filter((a) => a.type === 'EXPENSE');
  const revenueAccounts = accounts.filter((a) => a.type === 'REVENUE');

  if (
    !assetAccounts.length ||
    !expenseAccounts.length ||
    !revenueAccounts.length
  ) {
    throw new Error('Account tidak cukup untuk seed');
  }

  for (let i = 0; i < count; i++) {
    const date = generateRandomDate(
      new Date(2026, 0, 1, 0, 0, 0),
      new Date(2026, 11, 31, 0, 0, 0),
    );

    const amount = randomAmount();

    // pilih skenario random
    const scenario = Math.floor(Math.random() * 3);

    let debitAccount;
    let creditAccount;
    let description = '';

    switch (scenario) {
      case 0:
        // Asset → Expense (misalnya bayar biaya)
        debitAccount = pickRandom(expenseAccounts);
        creditAccount = pickRandom(assetAccounts);
        description = 'Expense Payment';
        break;

      case 1:
        // Revenue → Asset (misalnya terima uang)
        debitAccount = pickRandom(assetAccounts);
        creditAccount = pickRandom(revenueAccounts);
        description = 'Receive Revenue';
        break;

      case 2:
        // Asset → Asset (transfer antar akun)
        debitAccount = pickRandom(assetAccounts);
        creditAccount = pickRandom(assetAccounts);

        // hindari account sama
        while (creditAccount.id === debitAccount.id) {
          creditAccount = pickRandom(assetAccounts);
        }

        description = 'Transfer Asset';
        break;
    }

    await prisma.journalEntry.create({
      data: {
        date,
        description: `Dummy Journal ${description} #${i + 1}`,
        lines: {
          create: [
            {
              accountId: debitAccount.id,
              debit: amount,
              credit: 0,
            },
            {
              accountId: creditAccount.id,
              debit: 0,
              credit: amount,
            },
          ],
        },
      },
    });
  }
}
