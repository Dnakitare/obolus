<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Reports</h1>
      <div class="flex gap-2">
        <button class="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50" @click="exportCSV">Export CSV</button>
        <button class="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50" @click="exportPDF">Export PDF</button>
      </div>
    </div>

    <!-- Year selector -->
    <div class="mb-6">
      <select v-model="year" class="px-3 py-2 border rounded-lg text-sm" @change="fetchTaxSummary">
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>

    <LoadingSpinner v-if="loading" />

    <template v-else-if="taxSummary">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl shadow-sm border p-5">
          <p class="text-sm text-gray-500">Total Income</p>
          <p class="text-2xl font-bold text-green-600">${{ taxSummary.totalIncome.toFixed(2) }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border p-5">
          <p class="text-sm text-gray-500">Deductible Expenses</p>
          <p class="text-2xl font-bold text-blue-600">${{ taxSummary.totalDeductible.toFixed(2) }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border p-5">
          <p class="text-sm text-gray-500">Est. Taxable Income</p>
          <p class="text-2xl font-bold text-gray-800">${{ (taxSummary.totalIncome - taxSummary.totalDeductible).toFixed(2) }}</p>
        </div>
      </div>

      <!-- Deductible by Category -->
      <div class="bg-white rounded-xl shadow-sm border p-5 mb-6">
        <h2 class="text-lg font-semibold mb-4">Deductible Expenses by Category</h2>
        <table class="w-full">
          <thead class="border-b">
            <tr>
              <th class="text-left py-2 text-sm text-gray-500">Category</th>
              <th class="text-right py-2 text-sm text-gray-500">Amount</th>
              <th class="text-right py-2 text-sm text-gray-500">Count</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="cat in taxSummary.deductibleByCategory" :key="cat.categoryName">
              <td class="py-2 text-sm">{{ cat.categoryName }}</td>
              <td class="py-2 text-sm text-right font-medium">${{ cat.total.toFixed(2) }}</td>
              <td class="py-2 text-sm text-right text-gray-500">{{ cat.count }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Quarterly Breakdown -->
      <div class="bg-white rounded-xl shadow-sm border p-5">
        <h2 class="text-lg font-semibold mb-4">Quarterly Breakdown</h2>
        <table class="w-full">
          <thead class="border-b">
            <tr>
              <th class="text-left py-2 text-sm text-gray-500">Quarter</th>
              <th class="text-right py-2 text-sm text-gray-500">Income</th>
              <th class="text-right py-2 text-sm text-gray-500">Expenses</th>
              <th class="text-right py-2 text-sm text-gray-500">Deductible</th>
              <th class="text-right py-2 text-sm text-gray-500">Net</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="q in taxSummary.quarterlyBreakdown" :key="q.quarter">
              <td class="py-2 text-sm font-medium">{{ q.quarter }}</td>
              <td class="py-2 text-sm text-right text-green-600">${{ q.income.toFixed(2) }}</td>
              <td class="py-2 text-sm text-right text-red-600">${{ q.expenses.toFixed(2) }}</td>
              <td class="py-2 text-sm text-right text-blue-600">${{ q.deductible.toFixed(2) }}</td>
              <td class="py-2 text-sm text-right font-medium">${{ q.net.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-xs text-gray-400 mt-4 text-center">This is not tax advice. Consult your tax advisor.</p>
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
