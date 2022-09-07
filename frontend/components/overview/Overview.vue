<template>
  <div class="mx-5 my-6 relative shadow-lg sm:rounded-lg">
    <div class="p-5 relative">
      <button @click="applySearch('Band')">Search</button>
      <button @click="showMore">More</button>
      <div class="text-xl">Transactions</div>
      <FilterBar
        :accounts="accounts"
        :banks="banks"
        :query="this.$apollo.queries.transactions"
        @get-search="applySearch"
      />
      <Transactions :transactions="transactions" />
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import Transactions from "./Transactions.vue";
import FilterBar from "./FilterBar.vue";

export default {
  apollo: {
    transactions: {
      query: gql`query Query($searchTerm: String, $cursor: ID, $filter: Filter) {
        transactions(searchTerm: $searchTerm, cursor: $cursor, filter: $filter) {
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
      variables: {
          searchTerm: null,
          cursor: null,
          filter: null,
      },
    },
    accounts: {
      query: gql`query Accounts {
        accounts {
          name
        }
      }`,
      update: data => [... new Set(data.accounts.map(account => account.name))]
    },
    banks: {
      query: gql`query Accounts {
        accounts {
          bank
        }
      }`,
      update: data => [... new Set(data.accounts.map(account => account.bank))]
    },
  },

  methods: {
    showMore() {
      this.cursor = this.transactions[this.transactions.length - 1].id;

      this.$apollo.queries.transactions.fetchMore({
        variables: {
            searchTerm: this.searchTerm,
            cursor: this.cursor,
            filter: this.filter,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newTransactions = fetchMoreResult.transactions;
          return {
            __typename: previousResult.transactions.__typename,
            transactions: [...previousResult.transactions, ...newTransactions],
            cursor: this.cursor
          }
        }
      })
    },
    applySearch(searchTerm) {
      this.$apollo.queries.transactions.refetch({ searchTerm });
      this.searchTerm = searchTerm;
    }
  },

  created() {
    this.accounts = [... new Set(this.accounts.map(account => account.name))]
  },

  components: { Transactions, FilterBar },

  data() {
    return {
      transactions: [],
      accounts: [],
      searchTerm: null,
      cursor: null,
      filter: null,
    }
  }
}
</script>