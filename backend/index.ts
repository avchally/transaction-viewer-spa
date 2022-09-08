import { PrismaClient } from '@prisma/client';
import { ApolloServer, gql } from 'apollo-server';

const prisma = new PrismaClient();

// TypeScript type declarations
type TransactionsArgs = {
  cursor: string;
  searchTerm: string;
  filter: {
    bank: string;
    account: string;
    startMonth: number;
    endMonth: number;
  }
}

type TransactionArg = {
  id: string;
}

type CategoryUpsertArgs = {
  id: string;
  name: string;
  color: string;
}

type TransactionsUpdateArgs = {
  id: string;
  categoryId: string;
}

// GraphQL types
const typeDefs = gql`
  type Transaction {
    id: ID
    account: Account
    category: Category
    reference: String
    amount: Float
    currency: String
    date: Float
  }

  type Account {
    id: ID,
    name: String
    bank: String
  }

  type Bank {
    name: String
  }

  type Category {
    id: ID,
    name: String,
    color: String
  }

  input Filter {
    bank: String,
    account: String,
    startMonth: String,
    endMonth: String
  }
  
  type Query {
    transactions(cursor: ID, searchTerm: String, filter: Filter): [Transaction]
    transaction(id: ID): Transaction
    categories: [Category]
    accounts: [Account]
  }

  type Mutation {
    categoryUpdate(id: ID, color: String): Category
    categoryAdd(name: String, color: String): Category
    transaction(id: ID, categoryId: ID): Transaction
  }
`

// temporary test data
const transactions = [
  {
    id: '6ad0e563-7f94-417d-8370-7eca2e52b2cc',
    account: {
      name: 'Main',
      bank: 'Ohnward'
    },
    category: {
      name: 'Other',
      color: 'ffbf84'
    },
    reference: 'Reference text',
    amount: 3.50,
    currency: 'EUR',
    date: String(new Date())
  },
  {
    id: '7ad0e563-7f94-417d-8370-7eca2e52b2cc',
    account: {
      name: 'Savings',
      bank: 'Bank of America'
    },
    category: {
      name: 'Savings Related',
      color: 'ff6955'
    },
    reference: 'Bought something',
    amount: 5.50,
    currency: 'GBP',
    date: String(new Date())
  }
]

// setting up resolvers
// TODO: move to its own module
const resolvers = {
  Query: {
    transactions: (parent: unknown, args: TransactionsArgs, context: unknown, info: unknown) => {
      const take = 50;
      const searchTermQuery = [
        {
          reference: {
            contains: args.searchTerm ? args.searchTerm : '',
            mode: 'insensitive' as const
          },
        },
        {
          currency: {
            contains: args.searchTerm ? args.searchTerm : '',
            mode: 'insensitive' as const
          },
        },
        {
          amount: args.searchTerm && !isNaN(Number(args.searchTerm)) ? Number(args.searchTerm) : undefined
        },
        {
          account: {
            OR: [
              {
                name: {
                  contains: args.searchTerm ? args.searchTerm : '',
                  mode: 'insensitive' as const
                }
              },
              {
                bank: {
                  contains: args.searchTerm ? args.searchTerm : '',
                  mode: 'insensitive' as const
                }
              }
            ]
          }
        },
        {
          category: {
            OR: [
              {
                name: {
                  contains: args.searchTerm ? args.searchTerm : '',
                  mode: 'insensitive' as const
                }
              },
              {
                color: {
                  contains: args.searchTerm ? args.searchTerm : '',
                  mode: 'insensitive' as const
                }
              }
            ]
          }
        },
        // If there is time, figure out how to search by date
        // {
        //   AND: [
        //     {
        //       date: {
        //         gte: args.searchTerm && !isNaN(Number(args.searchTerm)) ? new Date(args.searchTerm) : undefined
        //       }
        //     },
        //     {
        //       date: {
        //         lt: args.searchTerm && !isNaN(Number(args.searchTerm)) ? new Date(Number(args.searchTerm) + 86400000): undefined
        //       }
        //     }
        //   ]
        // }
      ];
      const filterQuery = {
        account: {
          name: args.filter && args.filter.account ? args.filter.account : undefined,
          bank: args.filter && args.filter.bank ? args.filter.bank : undefined
        },
        AND: [
          {
            date: {
              gte: args.filter && args.filter.startMonth ? new Date(args.filter.startMonth) : undefined
            }
          },
          {
            date: {
              lte: args.filter && args.filter.endMonth ? new Date(args.filter.endMonth): undefined
            }
          }
        ]
      }
      const query = {
        where: {
          OR: searchTermQuery,
          AND: filterQuery
        },
        orderBy: {
          date: 'asc'
        } as const,
        include: {
          account: true,
          category: true
        }
      }

      // console.log(args.cursor);

      // utilizing Prisma's cursor feature for infinite scrolling/pagination
      if (args.cursor) {
        return prisma.transaction.findMany({
          ...query,
          take,
          skip: 1,
          cursor: {
            id: args.cursor
          }
        });
      }
      return prisma.transaction.findMany({
        ...query,
        take,
      });
    },
    transaction: async (parent: unknown, args: TransactionArg, context: unknown, info: unknown) => {
      console.log(args);
      if (!args.id) return null;
      return await prisma.transaction.findUnique({
        where: {
          id: args.id
        },
        include: {
          account: true,
          category: true
        }
      })
    },
    categories: () => prisma.category.findMany(),
    accounts: () => prisma.account.findMany(),
  },
  Mutation: {
    categoryUpdate: async (parent: unknown, args: CategoryUpsertArgs, context: unknown, info: unknown) => {
      await prisma.category.update({
        where: {
          id: args.id
        },
        data: {
          color: args.color,
        },
      })
    },
    categoryAdd: async (parent: unknown, args: CategoryUpsertArgs, context: unknown, info: unknown) => {
      await prisma.category.create({
        data: {
          name: args.name,
          color: args.color,
        },
      })
    },
    transaction: async (parent: unknown, args: TransactionsUpdateArgs, context: unknown, info: unknown) => {
      return await prisma.transaction.update({
        where: {
          id: "8944125f-06ba-4438-a8ef-fd3955862777"
        },
        data: {
          categoryId: args.categoryId
        },
        include: {
          account: true,
          category: true
        }
      })
    },
  }
}


// setup and start Apollo Server
const {
  ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true })
  ]
});

server.listen().then(({ url }: { url: string }) => {
  console.log(`Server started at: ${url}`);
})