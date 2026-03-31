<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Transactions</h1>
      <button class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium" @click="showForm = true">
        + Add Transaction
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm border p-4 mb-4 flex flex-wrap gap-3 items-end">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Type</label>
        <select v-model="localFilters.type" class="px-3 py-2 border rounded-lg text-sm" @change="applyFilters">
          <option :value="undefined">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">Category</label>
        <select v-model="localFilters.categoryId" class="px-3 py-2 border rounded-lg text-sm" @change="applyFilters">
          <option :value="undefined">All</option>
          <option v-for="cat in categories.categories" :key="cat.id" :value="cat.id">{{ cat.icon }} {{ cat.name }}</option>
        </select>
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">From</label>
        <input v-model="localFilters.startDate" type="date" class="px-3 py-2 border rounded-lg text-sm" @change="applyFilters" />
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">To</label>
        <input v-model="localFilters.endDate" type="date" class="px-3 py-2 border rounded-lg text-sm" @change="applyFilters" />
      </div>
      <div class="flex-1 min-w-[200px]">
        <label class="block text-xs text-gray-500 mb-1">Search</label>
        <input v-model="localFilters.search" type="text" placeholder="Search descriptions..." class="w-full px-3 py-2 border rounded-lg text-sm" @input="applyFilters" />
      </div>
    </div>

    <LoadingSpinner v-if="store.loading" />

    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Description</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="tx in store.transactions" :key="tx.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm">{{ new Date(tx.date).toLocaleDateString() }}</td>
            <td class="px-4 py-3 text-sm">
              {{ tx.description }}
              <span v-if="tx.isTaxDeductible" class="ml-1 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Tax</span>
              <span v-if="tx.receiptPath" class="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Receipt</span>
            </td>
            <td class="px-4 py-3 text-sm">
              <span class="inline-flex items-center gap-1">
                {{ tx.category.icon }} {{ tx.category.name }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-right font-medium" :class="tx.type === 'income' ? 'text-green-600' : 'text-red-600'">
              {{ tx.type === 'income' ? '+' : '-' }}{{ formatAmount(tx.amount, tx.currency) }}
            </td>
            <td class="px-4 py-3 text-sm text-right">
              <button class="text-gray-400 hover:text-primary-600 mr-2" @click="editTx = tx; showForm = true">Edit</button>
              <button class="text-gray-400 hover:text-red-600" @click="handleDelete(tx.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="!store.transactions.length">
            <td colspan="5" class="text-center py-8 text-gray-400">No transactions found</td>
          </tr>
        </tbody>
      </table>
      <BasePagination
        :page="store.meta.page"
        :total-pages="store.meta.totalPages"
        :total="store.meta.total"
        class="px-4 pb-4"
        @update:page="(p: number) => store.fetchTransactions({ page: p })"
      />
    </div>

    <!-- Modal Form -->
    <BaseModal v-if="showForm" :title="editTx ? 'Edit Transaction' : 'Add Transaction'" @close="closeForm">
      <TransactionForm :transaction="editTx" @saved="closeForm" />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transaction.store';
import { useCategoryStore } from '@/stores/category.store';
import { useUiStore } from '@/stores/ui.store';
import { useCurrency } from '@/composables/useCurrency';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import BasePagination from '@/components/ui/BasePagination.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import TransactionForm from '@/components/transactions/TransactionForm.vue';
import type { Transaction } from '@/types';

const store = useTransactionStore();
const categories = useCategoryStore();
const ui = useUiStore();
const { formatAmount } = useCurrency();

const showForm = ref(false);
const editTx = ref<Transaction | null>(null);
const localFilters = reactive<Record<string, unknown>>({});

function closeForm() {
  showForm.value = false;
  editTx.value = null;
}

function applyFilters() {
  store.fetchTransactions({ ...localFilters, page: 1 });
}

async function handleDelete(id: number) {
  const ok = await ui.confirm('Delete this transaction? This cannot be undone.');
  if (ok) await store.deleteTransaction(id);
}

onMounted(() => {
  store.fetchTransactions();
  categories.fetchCategories();
});
</script>
