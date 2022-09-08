<template>
  <div class="flex justify-center bg-indigo-100">
    <div class="mx-5 my-6 relative shadow-lg sm:rounded-lg max-w-5xl bg-gray-100">
      <div class="p-5 relative">
        <div class="text-xl">Transactions</div>
        <FilterBar
          :accounts="accounts"
          :banks="banks"
          :query="this.$apollo.queries.transactions"
          @get-search="applySearch"
          @get-filter="applyFilter"
        />

        <Transactions 
          :transactions="transactions"
          @open-modal="(transactionId) => showModal(transactionId)"
        />
        
        <div class="flex justify-center">
          <button 
          class="m-2 px-10 py-1 rounded-xl bg-gray-300 shadow-sm
          "
          @click="showMore"
          >
          Load More
        </button>
        <TransactionWindow 
          v-show="isModalVisible"
          @close="closeModal"
          :id="detailsId"
        />
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import Transactions from "./Transactions.vue";
import FilterBar from "./FilterBar.vue";
import TransactionWindow from "../details/TransactionWindow.vue";

export default {
  apollo: {
    transactions: {
      query: gql`query Query($searchTerm: String, $cursor: ID, $filter: Filter) {
        transactions(searchTerm: $searchTerm, cursor: $cursor, filter: $filter) {
          id
          account {
            id
            name
            bank
          }
          category {
            id
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
        filter: {
          bank: null,
          account: null,
          startMonth: null,
          endMonth: null,
        },
      },
      deep: true,
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
    },
    applyFilter(filter) {
      console.log(filter);
      this.$apollo.queries.transactions.refetch({ filter });
      this.filter = filter;
    },
    showModal(id) {
      // this.$apollo.queries.transactions.refetch();
      this.detailsId = id;
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    }
  },

  components: { Transactions, FilterBar, TransactionWindow },

  data() {
    return {
      transactions: [],
      accounts: [],
      searchTerm: null,
      cursor: null,
      filter: {
        bank: null,
        account: null,
        startMonth: null,
        endMonth: null,
      },
      isModalVisible: false,
      detailsId: null,
    }
  }
}
</script>