import client from './client';
export const transactionApi = {
    getAll(filters = {}) {
        return client.get('/transactions', { params: filters });
    },
    getOne(id) {
        return client.get(`/transactions/${id}`);
    },
    create(data) {
        return client.post('/transactions', data);
    },
    update(id, data) {
        return client.patch(`/transactions/${id}`, data);
    },
    delete(id) {
        return client.delete(`/transactions/${id}`);
    },
};
