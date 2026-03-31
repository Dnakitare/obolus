<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select v-model="form.type" required class="w-full px-3 py-2 border rounded-lg text-sm">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input v-model="form.date" type="date" required class="w-full px-3 py-2 border rounded-lg text-sm" />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input v-model.number="form.amount" type="number" step="0.01" min="0.01" required class="w-full px-3 py-2 border rounded-lg text-sm" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Currency</label>
        <select v-model="form.currency" class="w-full px-3 py-2 border rounded-lg text-sm">
          <option v-for="c in currencies" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
      <select v-model="form.categoryId" required class="w-full px-3 py-2 border rounded-lg text-sm">
        <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">{{ cat.icon }} {{ cat.name }}</option>
      </select>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <input v-model="form.description" type="text" required maxlength="500" class="w-full px-3 py-2 border rounded-lg text-sm" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
      <textarea v-model="form.notes" rows="2" maxlength="2000" class="w-full px-3 py-2 border rounded-lg text-sm" />
    </div>
    <div class="flex items-center gap-2">
      <input id="taxDeductible" v-model="form.isTaxDeductible" type="checkbox" class="rounded" />
      <label for="taxDeductible" class="text-sm text-gray-700">Tax deductible</label>
    </div>
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
    <button type="submit" :disabled="loading"
      class="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium text-sm">
      {{ loading ? 'Saving...' : (props.transaction ? 'Update' : 'Create') }}
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
