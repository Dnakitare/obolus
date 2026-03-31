import { defineStore } from 'pinia';
import { ref } from 'vue';
import { dashboardApi } from '@/api/dashboard.api';
import type { DashboardSummary, TrendData, CategoryBreakdown, BudgetStatus } from '@/types';

export const useDashboardStore = defineStore('dashboard', () => {
  const summary = ref<DashboardSummary | null>(null);
  const trends = ref<TrendData[]>([]);
  const categoryBreakdown = ref<CategoryBreakdown[]>([]);
  const budgetStatus = ref<BudgetStatus[]>([]);
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
    } finally {
      loading.value = false;
    }
  }

  async function setPeriod(p: string) {
    period.value = p;
    await fetchAll();
  }

  return { summary, trends, categoryBreakdown, budgetStatus, loading, period, fetchAll, setPeriod };
});
