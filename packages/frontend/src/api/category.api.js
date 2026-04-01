import client from './client';
export const categoryApi = {
    getAll(type) {
        return client.get('/categories', { params: type ? { type } : {} });
    },
    create(data) {
        return client.post('/categories', data);
    },
    update(id, data) {
        return client.patch(`/categories/${id}`, data);
    },
    delete(id) {
        return client.delete(`/categories/${id}`);
    },
};
