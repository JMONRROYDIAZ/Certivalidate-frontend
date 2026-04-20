import { request } from './api';

export const authService = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password }, auth: false }),

  register: (data) =>
    request('/auth/register', { method: 'POST', body: data, auth: false }),

  logout: (refreshToken) =>
    request('/auth/logout', { method: 'POST', body: { refreshToken } }),

  getProfile: () =>
    request('/auth/perfil'),

  updateProfile: (data) =>
    request('/auth/perfil', { method: 'PUT', body: data }),

  changePassword: (currentPassword, newPassword) =>
    request('/auth/perfil/password', { method: 'PUT', body: { currentPassword, newPassword } }),
};
