<template>
  <div class="mx-auto m-4">
    <h2 class="text-3xl font-bold mb-5 text-center">Income</h2>
    <table class="min-w-full bg-white">
      <thead>
        <tr>
          <th class="py-2">Date</th>
          <th class="py-2">Amount</th>
          <th class="py-2">Source</th>
          <th class="py-2">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="income in incomes" :key="income.id">
          <td class="border px-4 py-2">{{ income.date }}</td>
          <td class="border px-4 py-2">{{ income.amount }}</td>
          <td class="border px-4 py-2">{{ income.source }}</td>
          <td class="border px-4 py-2">{{ income.description }}</td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-center">
      <button @click="$emit('openIncomeForm')" type="submit" class="m-4 bg-green-500 text-white hover:bg-green-700 py-2 px-4 font-bold rounded-full">Add Income</button>
    </div>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  data() {
    return {
      incomes: []
    };
  },
  created() {
    axios.get('/income')
      .then(response => {
        this.incomes = response.data;
      })
      .catch(error => {
        console.error(error);
      });
  }
};
</script>

<style scoped>
</style>