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
        <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Frequency</label>
        <select v-model="form.frequency" required class="input-field">
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
        <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Amount</label>
        <input v-model.number="form.amount" type="number" step="0.01" min="0.01" required class="input-field" placeholder="0.00" />
      </div>
      <div>
        <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Category</label>
        <select v-model="form.categoryId" required class="input-field">
          <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">{{ cat.icon }} {{ cat.name }}</option>
        </select>
      </div>
    </div>
    <div>
      <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Description</label>
      <input v-model="form.description" type="text" required class="input-field" placeholder="e.g. Monthly rent" />
    </div>
    <div>
      <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Start Date</label>
      <input v-model="form.startDate" type="date" required class="input-field" />
    </div>
    <button type="submit" :disabled="loading" class="btn-primary w-full justify-center">
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
