import { PrismaClient, AccountType } from '@prisma/client';
import { COA_DATA } from './coa.data';
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function resolveAccountType(code: string): AccountType {
  switch (code[0]) {
    case '1':
      return AccountType.ASSET;
    case '2':
      return AccountType.LIABILITY;
    case '3':
      return AccountType.EQUITY;
    case '4':
      return AccountType.REVENUE;
    case '5':
      return AccountType.EXPENSE;
    default:
      return AccountType.OTHER;
  }
}

function isPostingAccount(code: string): boolean {
  const [, , , d] = code.split('.');
  return d !== '00';
}

function getParentCode(code: string): string | null {
  const [a, b, c, d] = code.split('.');

  // Code 1.00.00.00 Then null
  if (b === '00' && c === '00' && d === '00') return null;

  // Code 1.01.00.00 Then 1.00.00.00
  if (c === '00' && d === '00') return `${a}.00.00.00`;

  // Code 1.01.01.00 Then 1.01.00.00
  if (d === '00') return `${a}.${b}.00.00`;

  return `${a}.${b}.${c}.00`;
}

export async function seedCOA() {
  const codeToId = new Map<string, string>();

  // STEP 1 — insert without parent
  for (const coa of COA_DATA) {
    const record = await prisma.chartOfAccount.create({
      data: {
        code: coa.code,
        name: coa.name,
        type: resolveAccountType(coa.code),
        isPosting: isPostingAccount(coa.code),
      },
    });

    codeToId.set(coa.code, record.id);
  }

  // STEP 2 — update parentId
  for (const coa of COA_DATA) {
    const parentCode = getParentCode(coa.code);
    if (!parentCode) continue;

    await prisma.chartOfAccount.update({
      where: { code: coa.code },
      data: {
        parentId: codeToId.get(parentCode),
      },
    });
  }

  console.log('✅ COA seeded successfully');
}
