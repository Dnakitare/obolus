import client from './client';

export const currencyApi = {
  getAll() {
    return client.get<{ data: string[] }>('/currencies');
  },
  getRate(from: string, to: string, date?: string) {
    return client.get<{ from: string; to: string; rate: number; date: string }>('/currencies/rate', { params: { from, to, date } });
  },
};
