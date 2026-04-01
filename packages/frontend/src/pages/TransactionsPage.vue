<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="page-title">Transactions</h1>
      <button class="btn-primary" @click="showForm = true">+ Add Transaction</button>
    </div>

    <!-- Filters -->
    <div class="card p-4 mb-4 flex flex-wrap gap-3 items-end">
      <div>
        <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Type</label>
        <select v-model="localFilters.type" class="select-field" @change="applyFilters">
          <option :value="undefined">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <div>
        <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Category</label>
        <select v-model="localFilters.categoryId" class="select-field" @change="applyFilters">
          <option :value="undefined">All</option>
          <option v-for="cat in categories.categories" :key="cat.id" :value="cat.id">{{ cat.icon }} {{ cat.name }}</option>
        </select>
      </div>
      <div>
        <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">From</label>
        <input v-model="localFilters.startDate" type="date" class="input-field !w-auto" @change="applyFilters" />
      </div>
      <div>
        <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">To</label>
        <input v-model="localFilters.endDate" type="date" class="input-field !w-auto" @change="applyFilters" />
      </div>
      <div class="flex-1 min-w-[200px]">
        <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Search</label>
        <input v-model="localFilters.search" type="text" placeholder="Search descriptions..." class="input-field" @input="applyFilters" />
      </div>
    </div>

    <LoadingSpinner v-if="store.loading" />

    <!-- Table -->
    <div v-else class="card overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50/80 border-b border-gray-100">
          <tr>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
            <th class="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
            <th class="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="tx in store.transactions" :key="tx.id" class="hover:bg-primary-50/30 transition-colors">
            <td class="px-4 py-3.5 text-sm text-gray-600">{{ new Date(tx.date).toLocaleDateString() }}</td>
            <td class="px-4 py-3.5 text-sm font-medium text-gray-800">
              {{ tx.description }}
              <span v-if="tx.isTaxDeductible" class="ml-1.5 text-[10px] font-bold bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full uppercase">Tax</span>
              <span v-if="tx.receiptPath" class="ml-1.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full uppercase">Receipt</span>
            </td>
            <td class="px-4 py-3.5 text-sm text-gray-600">
              <span class="inline-flex items-center gap-1.5">
                <span class="text-base">{{ tx.category.icon }}</span> {{ tx.category.name }}
              </span>
            </td>
            <td class="px-4 py-3.5 text-sm text-right font-bold tabular-nums" :class="tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'">
              {{ tx.type === 'income' ? '+' : '-' }}{{ formatAmount(tx.amount, tx.currency) }}
            </td>
            <td class="px-4 py-3.5 text-sm text-right space-x-1">
              <button class="text-gray-400 hover:text-primary-600 transition-colors font-medium" @click="editTx = tx; showForm = true">Edit</button>
              <button class="text-gray-400 hover:text-rose-600 transition-colors font-medium" @click="handleDelete(tx.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="!store.transactions.length">
            <td colspan="5" class="text-center py-20">
              <div class="text-5xl mb-4 opacity-60">📭</div>
              <p class="text-gray-600 font-semibold text-lg">No transactions yet</p>
              <p class="text-gray-400 text-sm mt-1">Click "+ Add Transaction" to get started</p>
            </td>
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
