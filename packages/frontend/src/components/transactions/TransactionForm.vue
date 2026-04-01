<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Type</label>
        <select v-model="form.type" required class="input-field">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div>
        <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Date</label>
        <input v-model="form.date" type="date" required class="input-field" />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Amount</label>
        <input v-model.number="form.amount" type="number" step="0.01" min="0.01" required class="input-field" placeholder="0.00" />
      </div>
      <div>
        <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Currency</label>
        <select v-model="form.currency" class="input-field">
          <option v-for="c in currencies" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
    </div>
    <div>
      <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Category</label>
      <select v-model="form.categoryId" required class="input-field">
        <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">{{ cat.icon }} {{ cat.name }}</option>
      </select>
    </div>
    <div>
      <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Description</label>
      <input v-model="form.description" type="text" required maxlength="500" class="input-field" placeholder="What was this for?" />
    </div>
    <div>
      <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Notes (optional)</label>
      <textarea v-model="form.notes" rows="2" maxlength="2000" class="input-field" placeholder="Any additional details..." />
    </div>
    <div class="flex items-center gap-2.5">
      <input id="taxDeductible" v-model="form.isTaxDeductible" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
      <label for="taxDeductible" class="text-sm text-gray-600 font-medium">Tax deductible</label>
    </div>
    <p v-if="error" class="text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-xl font-medium">{{ error }}</p>
    <button type="submit" :disabled="loading" class="btn-primary w-full justify-center">
      {{ loading ? 'Saving...' : (props.transaction ? 'Update Transaction' : 'Create Transaction') }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transaction.store';
import { useCategoryStore } from '@/stores/category.store';
import type { Transaction } from '@/types';

const props = defineProps<{ transaction?: Transaction | null }>();
const emit = defineEmits<{ saved: [] }>();

const store = useTransactionStore();
const categories = useCategoryStore();
const loading = ref(false);
const error = ref('');
const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'KES', 'INR', 'BRL'];

const form = reactive({
  type: props.transaction?.type || 'expense',
  date: props.transaction?.date?.split('T')[0] || new Date().toISOString().split('T')[0],
  amount: props.transaction?.amount || 0,
  currency: props.transaction?.currency || 'USD',
  categoryId: props.transaction?.categoryId || 0,
  description: props.transaction?.description || '',
  notes: props.transaction?.notes || '',
  isTaxDeductible: props.transaction?.isTaxDeductible || false,
});

const filteredCategories = computed(() =>
  form.type === 'income' ? categories.incomeCategories : categories.expenseCategories
);

async function handleSubmit() {
  error.value = '';
  loading.value = true;
  try {
    if (props.transaction) {
      await store.updateTransaction(props.transaction.id, form);
    } else {
      await store.createTransaction(form);
    }
    emit('saved');
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { error?: string } } };
    error.value = axiosErr.response?.data?.error || 'Failed to save';
  } finally {
    loading.value = false;
  }
}

onMounted(() => categories.fetchCategories());
</script>
