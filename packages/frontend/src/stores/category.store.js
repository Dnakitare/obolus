import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { categoryApi } from '@/api/category.api';
import { useUiStore } from './ui.store';
export const useCategoryStore = defineStore('category', () => {
    const categories = ref([]);
    const loading = ref(false);
    const expenseCategories = computed(() => categories.value.filter(c => c.type === 'expense'));
    const incomeCategories = computed(() => categories.value.filter(c => c.type === 'income'));
    async function fetchCategories() {
        loading.value = true;
        try {
            const { data } = await categoryApi.getAll();
            categories.value = data.data;
        }
        finally {
            loading.value = false;
        }
    }
    async function createCategory(data) {
        const ui = useUiStore();
        await categoryApi.create(data);
        ui.showSuccess('Category created');
        await fetchCategories();
    }
    async function deleteCategory(id) {
        const ui = useUiStore();
        await categoryApi.delete(id);
        ui.showSuccess('Category deleted');
        await fetchCategories();
    }
    return { categories, loading, expenseCategories, incomeCategories, fetchCategories, createCategory, deleteCategory };
});
