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
        <label class="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
        <select v-model="form.frequency" required class="w-full px-3 py-2 border rounded-lg text-sm">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="biweekly">Biweekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input v-model.number="form.amount" type="number" step="0.01" min="0.01" required class="w-full px-3 py-2 border rounded-lg text-sm" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select v-model="form.categoryId" required class="w-full px-3 py-2 border rounded-lg text-sm">
          <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">{{ cat.icon }} {{ cat.name }}</option>
        </select>
      </div>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <input v-model="form.description" type="text" required class="w-full px-3 py-2 border rounded-lg text-sm" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
      <input v-model="form.startDate" type="date" required class="w-full px-3 py-2 border rounded-lg text-sm" />
    </div>
    <button type="submit" :disabled="loading"
      class="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium text-sm">
      {{ loading ? 'Creating...' : 'Create Rule' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { recurringApi } from '@/api/recurring.api';
import { useCategoryStore } from '@/stores/category.store';
import { useUiStore } from '@/stores/ui.store';

const emit = defineEmits<{ saved: [] }>();
const categories = useCategoryStore();
const ui = useUiStore();
const loading = ref(false);

const form = reactive({
  type: 'expense' as 'income' | 'expense',
  frequency: 'monthly',
  amount: 0,
  categoryId: 0,
  description: '',
  startDate: new Date().toISOString().split('T')[0],
});

const filteredCategories = computed(() =>
  form.type === 'income' ? categories.incomeCategories : categories.expenseCategories
);

async function handleSubmit() {
  loading.value = true;
  try {
    await recurringApi.create(form);
    ui.showSuccess('Recurring rule created');
    emit('saved');
  } catch {
    ui.showError('Failed to create rule');
  } finally {
    loading.value = false;
  }
}

onMounted(() => categories.fetchCategories());
</script>
