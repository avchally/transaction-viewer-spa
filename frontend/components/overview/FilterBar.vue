<template>
  <div class="flex text-m border-t-2 border-b-2">
    <div :class="`${tailwindStyles.container} w-3/6`">
      <label for="search">Search</label>
      <input 
        type="text"
        name="search"
        :class="tailwindStyles.input"
        placeholder="Search by bank, account, reference, category, amount, currency..."
      >
    </div>
    <div :class="`${tailwindStyles.container} w-1/6`">
      <label for="filter-bank">Bank</label>
      <select 
        name="filter-bank"
        :class="tailwindStyles.input"
      >
        <option value="0" disabled selected>
          No filter applied
        </option>
      </select>
    </div>
    <div :class="`${tailwindStyles.container} w-1/6`">
      <label for="filter-account">Account</label>
      <select 
        name="filter-account"
        :class="tailwindStyles.input"
      >
        <option value="0" disabled selected>
          No filter applied
        </option>
      </select>
    </div>
    <div :class="`${tailwindStyles.container}`">
      <label for="filter-start-date">Start Date</label>
      <input 
        type="date"
        name="filter-start-date"
        :class="tailwindStyles.input"
      >
    </div>
    <div :class="`${tailwindStyles.container}`">
      <label for="filter-end-date">End Date</label>
      <input 
        type="date"
        name="filter-end-date"
        :class="tailwindStyles.input"
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      banks: [],
      accounts: [],
      tailwindStyles: {
        input: 'border-2 py-1 px-2 md:rounded-sm',
        container: 'flex flex-col m-1'
      }
    }
  }
}
</script>