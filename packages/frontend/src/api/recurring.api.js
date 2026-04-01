import client from './client';
export const recurringApi = {
    getAll(isActive) {
        return client.get('/recurring', { params: isActive !== undefined ? { isActive } : {} });
    },
    create(data) {
        return client.post('/recurring', data);
    },
    update(id, data) {
        return client.patch(`/recurring/${id}`, data);
    },
    delete(id) {
        return client.delete(`/recurring/${id}`);
    },
    process() {
        return client.post('/recurring/process');
    },
};
