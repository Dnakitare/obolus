<template>
  <div class="max-w-md mx-auto mt-10">
    <div>
      <h2 class="text-3xl font-bold mb-5 text-center">Log Expense</h2>
    </div>
    <form @submit.prevent="logExpense">
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Date</label>
        <input v-model="date" type="date" class="w-full p-2 border border-gray-300 rounded"/>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Amount</label>
        <input v-model="amount" type="number" class="w-full p-2 border border-gray-300 rounded"/>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Category</label>
        <select v-model="category" class="w-full p-2 border border-gray-300 rounded">
          <option>Office Supplies</option>
          <option>Travel</option>
          <option>Meals</option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Description</label>
        <input v-model="description" type="text" class="w-full p-2 border border-gray-300 rounded"/>
      </div>
      <div class="flex justify-between">
        <button @click="$emit('close')" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">Close</button>
        <button type="submit" class="bg-blue-500 text-white hover:bg-blue-700 py-2 px-4 font-bold rounded-full">Add Expense</button>
      </div>
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
      category: 'Office Supplies',
      description: ''
    };
  },
  methods: {
    logExpense() {
      axios.post('/expenses', {
        date: this.date,
        amount: this.amount,
        category: this.category,
        description: this.description
      }).then(response => {
        console.log(response.data);
        this.$emit('close')
      }).catch(error => {
        console.error(error);
      });
    }
  }
};
</script>

<style scoped>
</style>