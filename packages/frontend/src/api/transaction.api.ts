import client from './client';
import type { Transaction, PaginatedResponse, ApiResponse } from '@/types';

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: 'income' | 'expense';
  categoryId?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const transactionApi = {
  getAll(filters: TransactionFilters = {}) {
    return client.get<PaginatedResponse<Transaction>>('/transactions', { params: filters });
  },
  getOne(id: number) {
    return client.get<ApiResponse<Transaction>>(`/transactions/${id}`);
  },
  create(data: Record<string, unknown>) {
    return client.post<ApiResponse<Transaction>>('/transactions', data);
  },
  update(id: number, data: Record<string, unknown>) {
    return client.patch<ApiResponse<Transaction>>(`/transactions/${id}`, data);
  },
  delete(id: number) {
    return client.delete(`/transactions/${id}`);
  },
};
