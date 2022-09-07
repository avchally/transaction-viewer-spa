<template>
  <div>
    <ul>
      <li v-for="tran in transactions" :key="tran.id">
        {{ `${tran.reference}: ${tran.amount} ${tran.currency}` }}
      </li>
    </ul>
  </div>
</template>

<script>
import gql from 'graphql-tag';

export default {
  name: 'DataExtractTestPage',

  apollo: {
    transactions: {
      query: gql`query Query {
        transactions {
          id
          account {
            name
            bank
          }
          category {
            name
            color
          }
          reference
          amount
          currency
          date
        }
      }`,
    }
  },

  components: {},

  data() {
    return {
      transactions: [
        {
          id: '12341235',
          reference: 'A reference',
          amount: '-1234.50',
          currency: 'GBP',
        },
        {
          id: '54983542',
          reference: 'Something else',
          amount: '100.00',
          currency: 'EUR',
        },
      ],
    }
  }
}

</script>