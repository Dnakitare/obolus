import client from './client';
export const reportApi = {
    getTaxSummary(year) {
        return client.get('/reports/tax-summary', { params: { year } });
    },
    exportCSV(params = {}) {
        return client.get('/reports/export/csv', { params, responseType: 'blob' });
    },
    exportPDF(params = {}) {
        return client.get('/reports/export/pdf', { params, responseType: 'blob' });
    },
};
