<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="page-title">Reports</h1>
      <div class="flex gap-2">
        <button class="btn-outline" @click="exportCSV">
          <svg class="w-4 h-4 inline -mt-0.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          CSV
        </button>
        <button class="btn-outline" @click="exportPDF">
          <svg class="w-4 h-4 inline -mt-0.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          PDF
        </button>
      </div>
    </div>

    <div class="mb-6">
      <select v-model="year" class="select-field" @change="fetchTaxSummary">
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>

    <LoadingSpinner v-if="loading" />

    <template v-else-if="taxSummary">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="card p-5 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
          <div class="relative">
            <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Total Income</p>
            <p class="text-2xl font-extrabold text-emerald-600">${{ taxSummary.totalIncome.toFixed(2) }}</p>
          </div>
        </div>
        <div class="card p-5 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent" />
          <div class="relative">
            <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Deductible Expenses</p>
            <p class="text-2xl font-extrabold text-primary-600">${{ taxSummary.totalDeductible.toFixed(2) }}</p>
          </div>
        </div>
        <div class="card p-5 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent" />
          <div class="relative">
            <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Est. Taxable Income</p>
            <p class="text-2xl font-extrabold text-violet-600">${{ (taxSummary.totalIncome - taxSummary.totalDeductible).toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <!-- Deductible by Category -->
      <div class="card p-6 mb-6">
        <h2 class="text-base font-bold text-gray-800 mb-4">Deductible Expenses by Category</h2>
        <table class="w-full">
          <thead class="border-b border-gray-100">
            <tr>
              <th class="text-left py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
              <th class="text-right py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
              <th class="text-right py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Count</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="cat in taxSummary.deductibleByCategory" :key="cat.categoryName" class="hover:bg-primary-50/30 transition-colors">
              <td class="py-3 text-sm font-medium text-gray-800">{{ cat.categoryName }}</td>
              <td class="py-3 text-sm text-right font-bold tabular-nums">${{ cat.total.toFixed(2) }}</td>
              <td class="py-3 text-sm text-right text-gray-400">{{ cat.count }}</td>
            </tr>
            <tr v-if="!taxSummary.deductibleByCategory.length">
              <td colspan="3" class="text-center py-8 text-gray-400 text-sm">No deductible expenses this year</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Quarterly Breakdown -->
      <div class="card p-6">
        <h2 class="text-base font-bold text-gray-800 mb-4">Quarterly Breakdown</h2>
        <table class="w-full">
          <thead class="border-b border-gray-100">
            <tr>
              <th class="text-left py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quarter</th>
              <th class="text-right py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Income</th>
              <th class="text-right py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Expenses</th>
              <th class="text-right py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Deductible</th>
              <th class="text-right py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Net</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="q in taxSummary.quarterlyBreakdown" :key="q.quarter" class="hover:bg-primary-50/30 transition-colors">
              <td class="py-3 text-sm font-bold text-gray-800">{{ q.quarter }}</td>
              <td class="py-3 text-sm text-right text-emerald-600 font-semibold tabular-nums">${{ q.income.toFixed(2) }}</td>
              <td class="py-3 text-sm text-right text-rose-600 font-semibold tabular-nums">${{ q.expenses.toFixed(2) }}</td>
              <td class="py-3 text-sm text-right text-primary-600 font-semibold tabular-nums">${{ q.deductible.toFixed(2) }}</td>
              <td class="py-3 text-sm text-right font-bold tabular-nums">${{ q.net.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-xs text-gray-400 mt-6 text-center font-medium">This is not tax advice. Consult your tax advisor.</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { reportApi } from '@/api/report.api';
import { useUiStore } from '@/stores/ui.store';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import type { TaxSummary } from '@/types';

const ui = useUiStore();
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
const year = ref(currentYear);
const taxSummary = ref<TaxSummary | null>(null);
const loading = ref(false);

async function fetchTaxSummary() {
  loading.value = true;
  try {
    const { data } = await reportApi.getTaxSummary(year.value);
    taxSummary.value = data.data;
  } finally {
    loading.value = false;
  }
}

async function exportCSV() {
  try {
    const { data } = await reportApi.exportCSV();
    const url = URL.createObjectURL(data as Blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `obolus-export-${year.value}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    ui.showSuccess('CSV exported');
  } catch {
    ui.showError('Export failed');
  }
}

async function exportPDF() {
  try {
    const { data } = await reportApi.exportPDF();
    const url = URL.createObjectURL(data as Blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `obolus-report-${year.value}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    ui.showSuccess('PDF exported');
  } catch {
    ui.showError('Export failed');
  }
}

onMounted(fetchTaxSummary);
</script>
