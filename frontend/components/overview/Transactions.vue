<template>
  <div class="overflow-x-auto overflow-y-auto">
    <table class="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400 sm:rounded-lg">
      <TransactionHeader />
      <tbody>
        <div v-if="$apollo.loading">Loading transactions...</div>
        <Transaction
          v-else-if="transactions && transactions.length > 0"
          v-for="tran in transactions"
          :key="tran.id"
          :id="tran.id"
          :reference="tran.reference"
          :categoryName="tran.category ? tran.category.name : null"
          :categoryColor="tran.category ? tran.category.color : null"
          :date="tran.date"
          :amount="tran.amount"
          :currency="tran.currency"
          @send-modal="(transactionId) => $emit('open-modal', transactionId)"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import TransactionHeader from "./TransactionHeader.vue";
import Transaction from "./Transaction.vue";

export default {
  props: ['transactions'],
  components: { TransactionHeader, Transaction },
}

</script>