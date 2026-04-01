import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '@/api/auth.api';
import router from '@/router';
export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const isAuthenticated = computed(() => !!localStorage.getItem('accessToken'));
    async function login(email, password) {
        const { data } = await authApi.login({ email, password });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        user.value = data.user;
        router.push('/dashboard');
    }
    async function register(email, password, displayName) {
        const { data } = await authApi.register({ email, password, displayName });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        user.value = data.user;
        router.push('/dashboard');
    }
    async function logout() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try {
                await authApi.logout(refreshToken);
            }
            catch { /* ignore */ }
        }
        localStorage.clear();
        user.value = null;
        router.push('/login');
    }
    async function fetchUser() {
        if (!isAuthenticated.value)
            return;
        try {
            const { data } = await authApi.getMe();
            user.value = data.data;
        }
        catch {
            await logout();
        }
    }
    async function updateProfile(data) {
        const response = await authApi.updateProfile(data);
        user.value = response.data.data;
    }
    async function changePassword(currentPassword, newPassword) {
        await authApi.changePassword({ currentPassword, newPassword });
    }
    return {
        user, isAuthenticated,
        login, register, logout, fetchUser, updateProfile, changePassword,
    };
});
