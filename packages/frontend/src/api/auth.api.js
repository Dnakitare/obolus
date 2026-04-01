import client from './client';
export const authApi = {
    register(data) {
        return client.post('/auth/register', data);
    },
    login(data) {
        return client.post('/auth/login', data);
    },
    refresh(refreshToken) {
        return client.post('/auth/refresh', { refreshToken });
    },
    logout(refreshToken) {
        return client.post('/auth/logout', { refreshToken });
    },
    getMe() {
        return client.get('/auth/me');
    },
    updateProfile(data) {
        return client.patch('/auth/me', data);
    },
    changePassword(data) {
        return client.patch('/auth/password', data);
    },
};
