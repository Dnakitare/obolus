<template>
  <div class="mx-auto mt-10">
    <h2 class="text-3xl font-bold mb-5 text-center">Expenses</h2>
    <table class="min-w-full bg-white">
      <thead>
        <tr>
          <th class="py-2">Date</th>
          <th class="py-2">Amount</th>
          <th class="py-2">Category</th>
          <th class="py-2">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="expense in expenses" :key="expense.id">
          <td class="border px-4 py-2">{{ expense.date }}</td>
          <td class="border px-4 py-2">{{ expense.amount }}</td>
          <td class="border px-4 py-2">{{ expense.category }}</td>
          <td class="border px-4 py-2">{{ expense.description }}</td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-center">
      <button @click="$emit('openExpenseForm')" type="submit" class="m-4 bg-green-500 text-white hover:bg-green-700 py-2 px-4 font-bold rounded-full">Add Expense</button>
    </div>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  data() {
    return {
      expenses: []
    };
  },
  created() {
    axios.get('/expenses')
      .then(response => {
        this.expenses = response.data;
      })
      .catch(error => {
        console.error(error);
      });
  }
};
</script>

<style scoped>
</style>