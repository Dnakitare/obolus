import client from './client';
export const budgetApi = {
    getAll(isActive) {
        return client.get('/budgets', { params: isActive !== undefined ? { isActive } : {} });
    },
    create(data) {
        return client.post('/budgets', data);
    },
    update(id, data) {
        return client.patch(`/budgets/${id}`, data);
    },
    delete(id) {
        return client.delete(`/budgets/${id}`);
    },
};
