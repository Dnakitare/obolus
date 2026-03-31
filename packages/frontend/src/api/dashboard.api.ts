import client from './client';
import type { DashboardSummary, TrendData, CategoryBreakdown, BudgetStatus } from '@/types';

export const dashboardApi = {
  getSummary(period: string = 'current_month', startDate?: string, endDate?: string) {
    return client.get<{ data: DashboardSummary }>('/dashboard/summary', { params: { period, startDate, endDate } });
  },
  getTrends(months: number = 6) {
    return client.get<{ data: TrendData[] }>('/dashboard/trends', { params: { months } });
  },
  getCategoryBreakdown(type: string = 'expense', period: string = 'current_month') {
    return client.get<{ data: CategoryBreakdown[] }>('/dashboard/by-category', { params: { type, period } });
  },
  getBudgetStatus() {
    return client.get<{ data: BudgetStatus[] }>('/dashboard/budget-status');
  },
};
