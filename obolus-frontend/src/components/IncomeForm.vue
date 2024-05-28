<template>
  <div class="max-w-md mx-auto mt-10">
    <h2 class="text-3xl font-bold mb-5 text-center">Log Income</h2>
    <form @submit.prevent="logIncome">
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Date</label>
        <input v-model="date" type="date" class="w-full p-2 border border-gray-300 rounded"/>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Amount</label>
        <input v-model="amount" type="number" class="w-full p-2 border border-gray-300 rounded"/>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Source</label>
        <select v-model="source" class="w-full p-2 border border-gray-300 rounded">
          <option>Client Payments</option>
          <option>Royalties</option>
          <option>Other</option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Description</label>
        <input v-model="description" type="text" class="w-full p-2 border border-gray-300 rounded"/>
      </div>
      <button type="submit" class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-700">Add Income</button>
    </form>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  data() {
    return {
      date: '',
      amount: '',
      source: 'Client Payments',
      description: ''
    };
  },
  methods: {
    logIncome() {
      axios.post('/income', {
        date: this.date,
        amount: this.amount,
        source: this.source,
        description: this.description
      }).then(response => {
        console.log(response.data);
      }).catch(error => {
        console.error(error);
      });
    }
  }
};
</script>

<style scoped>
</style>