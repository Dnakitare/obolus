<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="page-title">Recurring Transactions</h1>
      <button class="btn-primary" @click="showForm = true">+ Add Rule</button>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="card overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50/80 border-b border-gray-100">
          <tr>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Frequency</th>
            <th class="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Next Run</th>
            <th class="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="rule in rules" :key="rule.id" class="hover:bg-primary-50/30 transition-colors">
            <td class="px-4 py-3.5 text-sm font-medium text-gray-800">{{ rule.description }}</td>
            <td class="px-4 py-3.5 text-sm">
              <span class="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider"
                :class="rule.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'">
                {{ rule.type }}
              </span>
            </td>
            <td class="px-4 py-3.5 text-sm text-gray-600 capitalize">{{ rule.frequency }}</td>
            <td class="px-4 py-3.5 text-sm text-right font-bold tabular-nums">${{ rule.amount.toFixed(2) }}</td>
            <td class="px-4 py-3.5 text-sm text-gray-600">{{ new Date(rule.nextRunDate).toLocaleDateString() }}</td>
            <td class="px-4 py-3.5 text-sm text-right">
              <button class="text-gray-400 hover:text-rose-600 transition-colors font-medium" @click="handleDelete(rule.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="!rules.length">
            <td colspan="6" class="text-center py-20">
              <div class="text-5xl mb-4 opacity-60">🔄</div>
              <p class="text-gray-600 font-semibold text-lg">No recurring rules</p>
              <p class="text-gray-400 text-sm mt-1">Automate your regular income and expenses</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="showForm" title="Add Recurring Rule" @close="showForm = false">
      <RecurringForm @saved="showForm = false; fetchRules()" />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { recurringApi } from '@/api/recurring.api';
import { useUiStore } from '@/stores/ui.store';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import RecurringForm from '@/components/recurring/RecurringForm.vue';
import type { RecurringRule } from '@/types';

const ui = useUiStore();
const rules = ref<RecurringRule[]>([]);
const loading = ref(false);
const showForm = ref(false);

async function fetchRules() {
  loading.value = true;
  try {
    const { data } = await recurringApi.getAll();
    rules.value = data.data;
  } finally {
    loading.value = false;
  }
}

async function handleDelete(id: number) {
  const ok = await ui.confirm('Delete this recurring rule?');
  if (!ok) return;
  await recurringApi.delete(id);
  ui.showSuccess('Rule deleted');
  await fetchRules();
}

onMounted(fetchRules);
</script>
