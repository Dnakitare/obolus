<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Recurring Transactions</h1>
      <button class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium" @click="showForm = true">
        + Add Rule
      </button>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Description</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Frequency</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Next Run</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="rule in rules" :key="rule.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm">{{ rule.description }}</td>
            <td class="px-4 py-3 text-sm">
              <span :class="rule.type === 'income' ? 'text-green-600' : 'text-red-600'">{{ rule.type }}</span>
            </td>
            <td class="px-4 py-3 text-sm capitalize">{{ rule.frequency }}</td>
            <td class="px-4 py-3 text-sm text-right font-medium">${{ rule.amount.toFixed(2) }}</td>
            <td class="px-4 py-3 text-sm">{{ new Date(rule.nextRunDate).toLocaleDateString() }}</td>
            <td class="px-4 py-3 text-sm text-right">
              <button class="text-gray-400 hover:text-red-600" @click="handleDelete(rule.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="!rules.length">
            <td colspan="6" class="text-center py-16">
              <div class="text-4xl mb-3">🔄</div>
              <p class="text-gray-500 font-medium">No recurring rules</p>
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
