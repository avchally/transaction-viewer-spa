<template>
  <div 
    class="fixed top-0 bottom-0 left-0 right-0 bg-gray-500 bg-opacity-30 flex justify-center items-center"
  >
    <div
      class="relative bg-white shadow-lg overflow-x-auto flex flex-col min-h-1/2 justify-between items-center rounded-xl p-16"
    >
      <button
        type="button"
        class="absolute top-2 right-4"
        @click="close"
      >
        X
      </button>
      <div class="flex flex-col justify-between items-center">

        <div class="text-4xl pb-4">Transaction Details:</div>
        <div class="flex">
          <div class="m-3">
            <div class="border-b-2 border-black text-2xl">{{ accountName }}</div>
            <div>Account Name</div>
          </div>
          <div class="m-3">
            <div class="border-b-2 border-black text-2xl">{{ accountBank }}</div>
            <div>Bank Name</div>
          </div>
        </div>
        <div class="m-4">
          <span class="text-4xl">{{amount}}</span>
          <span class="text-lg">{{currency}}</span>
        </div>

        <div class="border-b-2 w-full border-gray-400"></div>
        
        <div class="grid grid-cols-3 gap-4 m-4">
          <div class="">Reference:</div>
          <div v-if="reference" class="col-span-2">{{ reference }}</div>
          <div v-else class="text-gray-400 italic col-span-2">No reference available</div>
          <div>Category:</div>
          <div class="col-span-2 flex items-center">
            <select 
              class="border-b-2"
              :style="`border-color:#${categoryColor}`"
              :value="categoryId"
              @input="updateCategory"
              ref="categorySelector"
            >
              <option 
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
              {{ categoryName }}
            
            </select>
            <div
              :style="`background-color:#${categoryColor}; min-width: 1.25rem`"
              @click="() => $refs.colorPick.click()"
              class="rounded-full w-5 h-5 mx-3 border-2"
            ></div>
            <input 
              ref="colorPick"
              class="inset-5"
              style="width:0; height:0;"
              type="color"
              :value="`#${categoryColor}`"
              @input="updateColor"
            >
          </div>
          <div>Date</div>
          <div class="col-span-2">{{ (new Date(date)).toLocaleDateString() }}</div>
          <div>Time</div>
          <div class="col-span-2">{{ (new Date(date)).toLocaleTimeString() }}</div>
          <!-- <div>{{ categoryColor }}</div> -->
        </div>
        <div>
        </div>

        <!-- <div>ID: {{ id }}</div>
        <div>reference: {{ reference }}</div>
        <div>amount: {{ amount }}</div>
        <div>currency: {{ currency }}</div> -->
      </div>
      <button
        type="button"
        class=""
        @click="close"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  
  export default {
    props: ['id'],

    apollo: {
      categories: {
        query: gql`query Query {
          categories {
            id
            name
            color
          }
        }`
      },
      transaction: {
        query: gql`query Transaction($transactionId: ID) {
          transaction(id: $transactionId) {
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
        variables() {
          return {
            transactionId: this.id
          }
        },
        result ({ data }) {
          if (!data.transaction) return;
          this.accountName = data.transaction.account.name || null
          this.accountBank = data.transaction.account.bank || null
          this.reference = data.transaction.reference
          this.amount = data.transaction.amount
          this.currency = data.transaction.currency
          this.date = data.transaction.date

          if (data.transaction.category){
            this.categoryId = data.transaction.category.id
            this.categoryName = data.transaction.category.name
            this.categoryColor = data.transaction.category.color
          }
        }
      }
    },

    methods: {
      close() {
        this.$emit('close');
      },
      updateCategory() {
        const category = this.categories.find(cat => cat.id = this.$refs.categorySelector.value);
        this.categoryId = category.id;
        this.categoryName = category.name;
        this.categoryColor = category.color;
        this.sendUpdatedCategory();
      },
      updateColor() {
        this.categoryColor = this.$refs.colorPick.value.slice(1);
        this.sendUpdatedColor()
      },
      sendUpdatedColor() {
        this.$apollo.mutate({
          mutation: gql`mutation Mutation($categoryUpdateId: ID, $color: String) {
            categoryUpdate(id: $categoryUpdateId, color: $color) {
              id
              name
              color
            }
          }`,
          variables: {
            categoryUpdateId: this.categoryId,
            color: this.categoryColor,
          }
        })
      },
      sendUpdatedCategory() {
        // for updating a transaction to a different category
        this.$apollo.mutate({
          mutation: gql`mutation Transaction($transactionId: ID, $categoryId: ID) {
            transaction(id: $transactionId, categoryId: $categoryId) {
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
            transactionId: this.id,
            categoryId: this.categoryId
          }
        })
      },
      sendNewCategory() {
        this.$apollo.mutate({
          mutation: gql`mutation Categories($name: String, $color: String) {
            categories(name: $name, color: $color) {
              id
              name
              color
            }
          }`,
          variables: {
            name: this.categoryName, 
            color: this.categoryColor
          }
        })
      },
    },

    data() {
      return {
        categories: [],
        transaction: {
          id: null,
          account: {
            name: null,
            bank: null,
          },
          category: {
            name: null,
            color: null,
          },
          reference: null,
          amount: null,
          currency: null,
          date: null,
        },
        // id: null,
        accountName: null,
        accountBank: null,
        categoryId: null,
        categoryName: null,
        categoryColor: null,
        reference: null,
        amount: null,
        currency: null,
        date: null,
      }
    }

  }
</script>