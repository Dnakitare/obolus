import client from './client';
import type { User } from '@/types';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  register(data: { email: string; password: string; displayName: string }) {
    return client.post<AuthResponse>('/auth/register', data);
  },
  login(data: { email: string; password: string }) {
    return client.post<AuthResponse>('/auth/login', data);
  },
  refresh(refreshToken: string) {
    return client.post<AuthResponse>('/auth/refresh', { refreshToken });
  },
  logout(refreshToken: string) {
    return client.post('/auth/logout', { refreshToken });
  },
  getMe() {
    return client.get<{ data: User }>('/auth/me');
  },
  updateProfile(data: { displayName?: string; defaultCurrency?: string }) {
    return client.patch<{ data: User }>('/auth/me', data);
  },
  changePassword(data: { currentPassword: string; newPassword: string }) {
    return client.patch('/auth/password', data);
  },
};
