<template>
  <div>
    <Header />
    <Navigation />
    <div class="container mx-auto mt-10">
      <ExpenseForm />
      <IncomeForm />
      <ExpenseList />
      <IncomeList />
    </div>
  </div>
</template>

<script>
import Header from './HeaderComponent.vue';
import Navigation from './NavigationComponent.vue';
import ExpenseForm from './ExpenseForm.vue';
import IncomeForm from './IncomeForm.vue';
import ExpenseList from './ExpenseList.vue';
import IncomeList from './IncomeList.vue';

export default {
  components: {
    Header,
    Navigation,
    ExpenseForm,
    IncomeForm,
    ExpenseList,
    IncomeList
  }
};
</script>

<style scoped>
</style>