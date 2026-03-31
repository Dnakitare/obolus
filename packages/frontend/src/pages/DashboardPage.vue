<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="page-title">Dashboard</h1>
      <select v-model="dashboard.period" class="select-field" @change="dashboard.fetchAll()">
        <option value="current_month">This Month</option>
        <option value="current_quarter">This Quarter</option>
        <option value="current_year">This Year</option>
      </select>
    </div>

    <LoadingSpinner v-if="dashboard.loading" />

    <template v-else>
      <!-- Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="card p-5 relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
          <div class="relative">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Total Income</p>
            <p class="text-2xl font-extrabold text-emerald-600">{{ formatUSD(dashboard.summary?.totalIncome ?? 0) }}</p>
          </div>
        </div>
        <div class="card p-5 relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent" />
          <div class="relative">
            <div class="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
            </div>
            <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Total Expenses</p>
            <p class="text-2xl font-extrabold text-rose-600">{{ formatUSD(dashboard.summary?.totalExpenses ?? 0) }}</p>
          </div>
        </div>
        <div class="card p-5 relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent" />
          <div class="relative">
            <div class="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Net Income</p>
            <p class="text-2xl font-extrabold" :class="(dashboard.summary?.netIncome ?? 0) >= 0 ? 'text-primary-600' : 'text-rose-600'">
              {{ formatUSD(dashboard.summary?.netIncome ?? 0) }}
            </p>
          </div>
        </div>
        <div class="card p-5 relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent" />
          <div class="relative">
            <div class="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            </div>
            <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Transactions</p>
            <p class="text-2xl font-extrabold text-violet-600">{{ dashboard.summary?.transactionCount ?? 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="card p-6">
          <h2 class="text-base font-bold text-gray-800 mb-4">Income vs Expenses</h2>
          <IncomeExpenseChart :data="dashboard.trends" />
        </div>
        <div class="card p-6">
          <h2 class="text-base font-bold text-gray-800 mb-4">Expense Breakdown</h2>
          <CategoryBreakdown :data="dashboard.categoryBreakdown" />
        </div>
      </div>

      <!-- Budget Status -->
      <div v-if="dashboard.budgetStatus.length" class="card p-6">
        <h2 class="text-base font-bold text-gray-800 mb-4">Budget Status</h2>
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
