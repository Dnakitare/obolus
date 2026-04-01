import axios from 'axios';
import router from '@/router';
const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/v1',
    headers: { 'Content-Type': 'application/json' },
});
let isRefreshing = false;
let failedQueue = [];
function processQueue(error, token) {
    failedQueue.forEach(({ resolve, reject }) => {
        if (token)
            resolve(token);
        else
            reject(error);
    });
    failedQueue = [];
}
client.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
client.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(client(originalRequest));
                    },
                    reject,
                });
            });
        }
        originalRequest._retry = true;
        isRefreshing = true;
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            processQueue(error, null);
            isRefreshing = false;
            localStorage.clear();
            router.push('/login');
            return Promise.reject(error);
        }
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL || '/api/v1'}/auth/refresh`, { refreshToken });
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            processQueue(null, data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return client(originalRequest);
        }
        catch (refreshError) {
            processQueue(refreshError, null);
            localStorage.clear();
            router.push('/login');
            return Promise.reject(refreshError);
        }
        finally {
            isRefreshing = false;
        }
    }
    // Network error (API unreachable)
    if (!error.response) {
        const { useUiStore } = await import('@/stores/ui.store');
        const ui = useUiStore();
        ui.showError('Unable to connect to server. Please check your connection.');
    }
    return Promise.reject(error);
});
export default client;
