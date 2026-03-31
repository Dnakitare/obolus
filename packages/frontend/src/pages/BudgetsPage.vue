<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Budgets</h1>
      <button class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium" @click="showForm = true">
        + Create Budget
      </button>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="b in budgets" :key="b.id" class="bg-white rounded-xl shadow-sm border p-5 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-gray-800">{{ b.category.icon }} {{ b.name }}</h3>
          <span class="text-xs px-2 py-0.5 rounded-full" :class="b.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
            {{ b.period }}
          </span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all"
            :class="b.percentUsed >= 100 ? 'bg-red-500' : b.percentUsed >= 80 ? 'bg-yellow-500' : 'bg-green-500'"
            :style="{ width: `${Math.min(b.percentUsed, 100)}%` }"
          />
        </div>
        <div class="flex justify-between text-sm text-gray-500">
          <span>${{ b.spent.toFixed(2) }} spent</span>
          <span>${{ b.amount.toFixed(2) }} limit</span>
        </div>
        <div class="text-right">
          <button class="text-xs text-red-500 hover:text-red-700" @click="handleDelete(b.id)">Delete</button>
        </div>
      </div>

      <div v-if="!budgets.length" class="col-span-full text-center py-16">
        <div class="text-5xl mb-3">🎯</div>
        <p class="text-gray-500 font-medium text-lg">No budgets yet</p>
        <p class="text-gray-400 text-sm mt-1">Create a budget to track spending against your goals</p>
      </div>
    </div>

    <BaseModal v-if="showForm" title="Create Budget" @close="showForm = false">
      <BudgetForm @saved="showForm = false; fetchBudgets()" />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { budgetApi } from '@/api/budget.api';
import { useUiStore } from '@/stores/ui.store';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import BudgetForm from '@/components/budgets/BudgetForm.vue';
import type { Budget } from '@/types';

const ui = useUiStore();
const budgets = ref<Budget[]>([]);
const loading = ref(false);
const showForm = ref(false);

async function fetchBudgets() {
  loading.value = true;
  try {
    const { data } = await budgetApi.getAll();
    budgets.value = data.data;
  } finally {
    loading.value = false;
  }
}

async function handleDelete(id: number) {
  const ok = await ui.confirm('Delete this budget?');
  if (!ok) return;
  await budgetApi.delete(id);
  ui.showSuccess('Budget deleted');
  await fetchBudgets();
}

onMounted(fetchBudgets);
</script>
