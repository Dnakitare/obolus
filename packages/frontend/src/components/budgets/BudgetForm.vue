<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
      <input v-model="form.name" type="text" required class="w-full px-3 py-2 border rounded-lg text-sm" />
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input v-model.number="form.amount" type="number" step="0.01" min="1" required class="w-full px-3 py-2 border rounded-lg text-sm" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Period</label>
        <select v-model="form.period" required class="w-full px-3 py-2 border rounded-lg text-sm">
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Expense Category</label>
      <select v-model="form.categoryId" required class="w-full px-3 py-2 border rounded-lg text-sm">
        <option v-for="cat in categories.expenseCategories" :key="cat.id" :value="cat.id">{{ cat.icon }} {{ cat.name }}</option>
      </select>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
      <input v-model="form.startDate" type="date" required class="w-full px-3 py-2 border rounded-lg text-sm" />
    </div>
    <button type="submit" :disabled="loading"
      class="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium text-sm">
      {{ loading ? 'Creating...' : 'Create Budget' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { budgetApi } from '@/api/budget.api';
import { useCategoryStore } from '@/stores/category.store';
import { useUiStore } from '@/stores/ui.store';

const emit = defineEmits<{ saved: [] }>();
const categories = useCategoryStore();
const ui = useUiStore();
const loading = ref(false);

const form = reactive({
  name: '',
  amount: 0,
  period: 'monthly',
  categoryId: 0,
  startDate: new Date().toISOString().split('T')[0],
});

async function handleSubmit() {
  loading.value = true;
  try {
    await budgetApi.create(form);
    ui.showSuccess('Budget created');
    emit('saved');
  } catch {
    ui.showError('Failed to create budget');
  } finally {
    loading.value = false;
  }
}

onMounted(() => categories.fetchCategories());
</script>
