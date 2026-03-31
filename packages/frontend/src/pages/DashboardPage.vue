<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
      <select v-model="dashboard.period" class="px-3 py-2 border rounded-lg text-sm" @change="dashboard.fetchAll()">
        <option value="current_month">This Month</option>
        <option value="current_quarter">This Quarter</option>
        <option value="current_year">This Year</option>
      </select>
    </div>

    <LoadingSpinner v-if="dashboard.loading" />

    <template v-else>
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl shadow-sm border p-5">
          <p class="text-sm text-gray-500">Total Income</p>
          <p class="text-2xl font-bold text-green-600">{{ formatUSD(dashboard.summary?.totalIncome ?? 0) }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border p-5">
          <p class="text-sm text-gray-500">Total Expenses</p>
          <p class="text-2xl font-bold text-red-600">{{ formatUSD(dashboard.summary?.totalExpenses ?? 0) }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border p-5">
          <p class="text-sm text-gray-500">Net Income</p>
          <p class="text-2xl font-bold" :class="(dashboard.summary?.netIncome ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ formatUSD(dashboard.summary?.netIncome ?? 0) }}
          </p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border p-5">
          <p class="text-sm text-gray-500">Transactions</p>
          <p class="text-2xl font-bold text-gray-800">{{ dashboard.summary?.transactionCount ?? 0 }}</p>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border p-5">
          <h2 class="text-lg font-semibold mb-4">Income vs Expenses</h2>
          <IncomeExpenseChart :data="dashboard.trends" />
        </div>
        <div class="bg-white rounded-xl shadow-sm border p-5">
          <h2 class="text-lg font-semibold mb-4">Expense Breakdown</h2>
          <CategoryBreakdown :data="dashboard.categoryBreakdown" />
        </div>
      </div>

      <!-- Budget Status -->
      <div v-if="dashboard.budgetStatus.length" class="bg-white rounded-xl shadow-sm border p-5">
        <h2 class="text-lg font-semibold mb-4">Budget Status</h2>
        <BudgetProgress :budgets="dashboard.budgetStatus" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useDashboardStore } from '@/stores/dashboard.store';
import { useCurrency } from '@/composables/useCurrency';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import IncomeExpenseChart from '@/components/dashboard/IncomeExpenseChart.vue';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown.vue';
import BudgetProgress from '@/components/dashboard/BudgetProgress.vue';

const dashboard = useDashboardStore();
const { formatUSD } = useCurrency();

onMounted(() => dashboard.fetchAll());
</script>
