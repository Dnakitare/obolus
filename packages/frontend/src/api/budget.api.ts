import client from './client';
import type { Budget, ApiResponse } from '@/types';

export const budgetApi = {
  getAll(isActive?: boolean) {
    return client.get<{ data: Budget[] }>('/budgets', { params: isActive !== undefined ? { isActive } : {} });
  },
  create(data: Record<string, unknown>) {
    return client.post<ApiResponse<Budget>>('/budgets', data);
  },
  update(id: number, data: Record<string, unknown>) {
    return client.patch<ApiResponse<Budget>>(`/budgets/${id}`, data);
  },
  delete(id: number) {
    return client.delete(`/budgets/${id}`);
  },
};
