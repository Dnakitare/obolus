import client from './client';
import type { Category, ApiResponse } from '@/types';

export const categoryApi = {
  getAll(type?: string) {
    return client.get<{ data: Category[] }>('/categories', { params: type ? { type } : {} });
  },
  create(data: { name: string; type: string; icon?: string; color?: string }) {
    return client.post<ApiResponse<Category>>('/categories', data);
  },
  update(id: number, data: Record<string, unknown>) {
    return client.patch<ApiResponse<Category>>(`/categories/${id}`, data);
  },
  delete(id: number) {
    return client.delete(`/categories/${id}`);
  },
};
