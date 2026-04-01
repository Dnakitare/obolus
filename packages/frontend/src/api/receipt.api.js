import client from './client';
export const receiptApi = {
    upload(transactionId, file) {
        const formData = new FormData();
        formData.append('file', file);
        return client.post(`/transactions/${transactionId}/receipt`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    download(transactionId) {
        return client.get(`/transactions/${transactionId}/receipt`, { responseType: 'blob' });
    },
    delete(transactionId) {
        return client.delete(`/transactions/${transactionId}/receipt`);
    },
};
