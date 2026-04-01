<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div>
      <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Name</label>
      <input v-model="form.name" type="text" required class="input-field" placeholder="e.g. Monthly Travel Budget" />
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Amount</label>
        <input v-model.number="form.amount" type="number" step="0.01" min="1" required class="input-field" placeholder="0.00" />
      </div>
      <div>
        <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Period</label>
        <select v-model="form.period" required class="input-field">
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
    </div>
    <div>
      <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Expense Category</label>
      <select v-model="form.categoryId" required class="input-field">
        <option v-for="cat in categories.expenseCategories" :key="cat.id" :value="cat.id">{{ cat.icon }} {{ cat.name }}</option>
      </select>
    </div>
    <div>
      <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Start Date</label>
      <input v-model="form.startDate" type="date" required class="input-field" />
    </div>
    <button type="submit" :disabled="loading" class="btn-primary w-full justify-center">
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
