import { defineStore } from 'pinia';
import { ref } from 'vue';
import { dashboardApi } from '@/api/dashboard.api';
export const useDashboardStore = defineStore('dashboard', () => {
    const summary = ref(null);
    const trends = ref([]);
    const categoryBreakdown = ref([]);
    const budgetStatus = ref([]);
    const loading = ref(false);
    const period = ref('current_month');
    async function fetchAll() {
        loading.value = true;
        try {
            const [s, t, c, b] = await Promise.all([
                dashboardApi.getSummary(period.value),
                dashboardApi.getTrends(),
                dashboardApi.getCategoryBreakdown('expense', period.value),
                dashboardApi.getBudgetStatus(),
            ]);
            summary.value = s.data.data;
            trends.value = t.data.data;
            categoryBreakdown.value = c.data.data;
            budgetStatus.value = b.data.data;
        }
        finally {
            loading.value = false;
        }
    }
    async function setPeriod(p) {
        period.value = p;
        await fetchAll();
    }
    return { summary, trends, categoryBreakdown, budgetStatus, loading, period, fetchAll, setPeriod };
});
