<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="page-title">Budgets</h1>
      <button class="btn-primary" @click="showForm = true">+ Create Budget</button>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="b in budgets" :key="b.id" class="card p-5 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-gray-800">{{ b.category.icon }} {{ b.name }}</h3>
          <span class="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
            :class="b.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'">
            {{ b.period }}
          </span>
        </div>
        <div class="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="b.percentUsed >= 100 ? 'bg-gradient-to-r from-rose-500 to-rose-400' : b.percentUsed >= 80 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'"
            :style="{ width: `${Math.min(b.percentUsed, 100)}%` }"
          />
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-500 font-medium">${{ b.spent.toFixed(2) }} spent</span>
          <span class="text-gray-400">${{ b.amount.toFixed(2) }} limit</span>
        </div>
        <div class="text-right pt-1 border-t border-gray-50">
          <button class="text-xs text-gray-400 hover:text-rose-600 transition-colors font-medium" @click="handleDelete(b.id)">Delete</button>
        </div>
      </div>

      <div v-if="!budgets.length" class="col-span-full text-center py-20">
        <div class="text-5xl mb-4 opacity-60">🎯</div>
        <p class="text-gray-600 font-semibold text-lg">No budgets yet</p>
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
