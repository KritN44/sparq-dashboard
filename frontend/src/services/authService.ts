import api from './api';
import { AuthTokens, RegisterData, User } from '../types/user';

export const authService = {
  async login(email: string, password: string): Promise<AuthTokens> {
    const form = new FormData();
    form.append('username', email);
    form.append('password', password);
    const { data } = await api.post<AuthTokens>('/auth/login', form);
    return data;
  },

  async register(userData: RegisterData): Promise<User> {
    const { data } = await api.post<User>('/auth/register', userData);
    return data;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  async updateProfile(fullName: string): Promise<User> {
    const { data } = await api.put<User>('/auth/me', { full_name: fullName });
    return data;
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout', { refresh_token: refreshToken });
  },
};
