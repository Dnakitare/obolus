import client from './client';
export const currencyApi = {
    getAll() {
        return client.get('/currencies');
    },
    getRate(from, to, date) {
        return client.get('/currencies/rate', { params: { from, to, date } });
    },
};
