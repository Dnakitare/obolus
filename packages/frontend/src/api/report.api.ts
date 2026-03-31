import client from './client';
import type { TaxSummary } from '@/types';

export const reportApi = {
  getTaxSummary(year: number) {
    return client.get<{ data: TaxSummary }>('/reports/tax-summary', { params: { year } });
  },
  exportCSV(params: { type?: string; startDate?: string; endDate?: string } = {}) {
    return client.get('/reports/export/csv', { params, responseType: 'blob' });
  },
  exportPDF(params: { type?: string; startDate?: string; endDate?: string } = {}) {
    return client.get('/reports/export/pdf', { params, responseType: 'blob' });
  },
};
