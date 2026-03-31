import client from './client';
import type { RecurringRule, ApiResponse } from '@/types';

export const recurringApi = {
  getAll(isActive?: boolean) {
    return client.get<{ data: RecurringRule[] }>('/recurring', { params: isActive !== undefined ? { isActive } : {} });
  },
  create(data: Record<string, unknown>) {
    return client.post<ApiResponse<RecurringRule>>('/recurring', data);
  },
  update(id: number, data: Record<string, unknown>) {
    return client.patch<ApiResponse<RecurringRule>>(`/recurring/${id}`, data);
  },
  delete(id: number) {
    return client.delete(`/recurring/${id}`);
  },
  process() {
    return client.post<{ created: number }>('/recurring/process');
  },
};
