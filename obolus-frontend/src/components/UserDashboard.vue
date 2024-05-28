<template>
  <div>
    <Header />
    <div class="container mx-auto mt-10">
      <div class="shadow-lg rounded-lg p-6 mb-6 w-auto">
        <ExpenseForm v-if="showExpenseForm" @close="showExpenseForm = false" />
        <ExpenseList v-if="!showExpenseForm" @openExpenseForm="showExpenseForm = true" />
      </div>
      <div class="shadow-lg rounded-lg p-6 w-auto">
        <IncomeForm v-if="showIncomeForm" @close="showIncomeForm = false" />
        <IncomeList v-if="!showIncomeForm" @openIncomeForm="showIncomeForm = true" />
      </div>
    </div>
  </div>
</template>

<script>
import Header from './HeaderComponent.vue';
import ExpenseForm from './ExpenseForm.vue';
import IncomeForm from './IncomeForm.vue';
import ExpenseList from './ExpenseList.vue';
import IncomeList from './IncomeList.vue';

export default {
  components: {
    Header,
    ExpenseForm,
    IncomeForm,
    ExpenseList,
    IncomeList
  },
  data() {
    return {
      showExpenseForm: false,
      showIncomeForm: false
    };
  }
};
</script>

<style scoped>
</style>