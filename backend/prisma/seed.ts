import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as csv from 'fast-csv';

const prisma = new PrismaClient();
const csvDir = './prisma/data';

// TypeScript type declarations
type AccountRow = {
  id: string;
  name: string;
  bank: string;
}

type CategoryRow = {
  id: string;
  name: string;
  color: string;
}

type TransactionRow = {
  id: string;
  accountId: string;
  categoryId: string | null;
  reference: string;
  amount: number;
  currency: string;
  date: Date;
}


async function main() {
  // Handle accounts.csv
  let accountsData: AccountRow[] = [];
  fs.createReadStream(`${csvDir}/accounts.csv`)
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', (row: AccountRow) => accountsData.push(row))
    .on('end', async (rowCount: number) => {
      await prisma.account.createMany({
        data: accountsData
      });
      console.log(`Finished reading accounts.csv: ${rowCount} row(s)`);
    });

  // Handle categories.csv
  let categoriesData: CategoryRow[] = [];
  fs.createReadStream(`${csvDir}/categories.csv`)
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', (row: CategoryRow) => categoriesData.push(row))
    .on('end', async (rowCount: number) => {
      await prisma.category.createMany({
        data: categoriesData
      });
      console.log(`Finished reading categories.csv: ${rowCount} row(s)`);
    });

  // Handle transactions.csv
  let transactionsData: TransactionRow[] = [];
  fs.createReadStream(`${csvDir}/transactions.csv`)
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.log(error))
    .on('data', (row: TransactionRow) => transactionsData.push({
      ...row,
      categoryId: row.categoryId ? row.categoryId : null,
      date: new Date(row.date)
    }))
    .on('end', async (rowCount: number) => {
      await prisma.transaction.createMany({
        data: transactionsData
      });
      console.log(`Finished reading transactions.csv: ${rowCount} row(s)`);
    });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async error => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });