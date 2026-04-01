import client from './client';
export const dashboardApi = {
    getSummary(period = 'current_month', startDate, endDate) {
        return client.get('/dashboard/summary', { params: { period, startDate, endDate } });
    },
    getTrends(months = 6) {
        return client.get('/dashboard/trends', { params: { months } });
    },
    getCategoryBreakdown(type = 'expense', period = 'current_month') {
        return client.get('/dashboard/by-category', { params: { type, period } });
    },
    getBudgetStatus() {
        return client.get('/dashboard/budget-status');
    },
};
