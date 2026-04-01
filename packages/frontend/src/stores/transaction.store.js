import { defineStore } from 'pinia';
import { ref } from 'vue';
import { transactionApi } from '@/api/transaction.api';
import { useUiStore } from './ui.store';
export const useTransactionStore = defineStore('transaction', () => {
    const transactions = ref([]);
    const meta = ref({ total: 0, page: 1, limit: 20, totalPages: 0 });
    const loading = ref(false);
    const filters = ref({ page: 1, limit: 20, sortBy: 'date', sortOrder: 'desc' });
    async function fetchTransactions(newFilters) {
        if (newFilters)
            Object.assign(filters.value, newFilters);
        loading.value = true;
        try {
            const { data } = await transactionApi.getAll(filters.value);
            transactions.value = data.data;
            meta.value = data.meta;
        }
        finally {
            loading.value = false;
        }
    }
    async function createTransaction(data) {
        const ui = useUiStore();
        const response = await transactionApi.create(data);
        if (response.data.warnings?.length) {
            for (const w of response.data.warnings) {
                if (w.percentUsed >= 100) {
                    ui.showError(`Budget "${w.name}" exceeded! (${w.percentUsed}% used)`);
                }
                else {
                    ui.showWarning(`Budget "${w.name}" at ${w.percentUsed}% capacity`);
                }
            }
        }
        ui.showSuccess('Transaction created');
        await fetchTransactions();
        return response.data.data;
    }
    async function updateTransaction(id, data) {
        const ui = useUiStore();
        await transactionApi.update(id, data);
        ui.showSuccess('Transaction updated');
        await fetchTransactions();
    }
    async function deleteTransaction(id) {
        const ui = useUiStore();
        await transactionApi.delete(id);
        ui.showSuccess('Transaction deleted');
        await fetchTransactions();
    }
    return {
        transactions, meta, loading, filters,
        fetchTransactions, createTransaction, updateTransaction, deleteTransaction,
    };
});
