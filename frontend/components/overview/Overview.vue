<template>
  <div class="mx-5 my-6 relative shadow-lg sm:rounded-lg">
    <div class="p-5 relative">
      <button @click="showMore">More</button>
      <button @click="applySearch('Band')">Search</button>
      <div class="text-xl">Transactions</div>
      <FilterBar />
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

    }
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

  components: { Transactions, FilterBar },

  data() {
    return {
      transactions: [],
      searchTerm: null,
      cursor: null,
      filter: null,
    }
  }
}
</script>