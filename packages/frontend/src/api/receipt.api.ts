import client from './client';

export const receiptApi = {
  upload(transactionId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return client.post(`/transactions/${transactionId}/receipt`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  download(transactionId: number) {
    return client.get(`/transactions/${transactionId}/receipt`, { responseType: 'blob' });
  },
  delete(transactionId: number) {
    return client.delete(`/transactions/${transactionId}/receipt`);
  },
};
