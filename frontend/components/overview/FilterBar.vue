<template>
  <div class="flex text-m border-t-2 border-b-2">
    <div :class="`${tailwindStyles.container} w-3/6`">
      
      <!-- Custom search box -->
      <label for="search">Search</label>
      <input 
        type="text"
        name="search"
        value=""
        :class="tailwindStyles.input"
        @input="event => $emit('get-search', event.target.value)"
        placeholder="Search by bank, account, reference, category, amount, currency..."
      >
    </div>

    <!-- Bank Filter -->
    <div :class="`${tailwindStyles.container} w-1/6`">
      <label for="filter-bank">Bank</label>
      <select 
        name="filter-bank"
        id="filter-bank"
        :class="tailwindStyles.input"
        @input="event => returnFilters(event.target.value, 'bank')"
      >
        <option value="" selected>
          No filter applied
        </option>
        <option v-for="bank in banks" :value="bank">{{ bank }}</option>
      </select>
    </div>

    <!-- Account Filter -->
    <div :class="`${tailwindStyles.container} w-1/6`">
      <label for="filter-account">Account</label>
      <select 
        name="filter-account"
        id="filter-account"
        :class="tailwindStyles.input"
        @input="event => returnFilters(event.target.value, 'account')"
      >
        <option value="" selected>
          No filter applied
        </option>
        <option v-for="account in accounts" :value="account">{{ account }}</option>
      </select>
    </div>

    <!-- Start Month Filter -->
    <div :class="`${tailwindStyles.container}`">
      <label for="filter-start-date">Start Month</label>
      <input 
        type="month"
        name="filter-start-date"
        id="filter-start-date"
        @input="event => returnFilters(event.target.value, 'startMonth')"
        :class="tailwindStyles.input"
      >
    </div>

    <!-- End Month Filter -->
    <div :class="`${tailwindStyles.container}`">
      <label for="filter-end-date">End Month</label>
      <input 
        type="month"
        name="filter-end-date"
        id="filter-end-date"
        @input="event => returnFilters(event.target.value, 'endMonth')"
        :class="tailwindStyles.input"
      >
    </div>

  </div>
</template>

<script>
export default {
  props: ['banks', 'accounts'],
  
  methods: {
    returnFilters(value, filter) {
      this.filter[filter] = value;
      console.log(this.filter);
      this.$emit('get-filter', this.filter);
    }
  },

  data() {
    return {
      tailwindStyles: {
        input: 'border-2 py-1 px-2 md:rounded-sm',
        container: 'flex flex-col m-1'
      },
      searchTerm: null,
      filter: {
        bank: null,
        account: null,
        startMonth: null,
        endMonth: null
      },
    }
  }
}
</script>