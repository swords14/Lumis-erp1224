// ──── API Services ────
import api from './api';
import type { PaginatedResponse } from '@ferramenta/shared';

// Generic CRUD Service
function createCRUDService<T extends { id: string }>(endpoint: string) {
  return {
    list: (params?: Record<string, any>) =>
      api.get<PaginatedResponse<T>>(endpoint, { params }).then((r) => r.data),
    get: (id: string) => api.get<T>(`${endpoint}/${id}`).then((r) => r.data),
    create: (data: Partial<T>) => api.post<T>(endpoint, data).then((r) => r.data),
    update: (id: string, data: Partial<T>) => api.put<T>(`${endpoint}/${id}`, data).then((r) => r.data),
    delete: (id: string) => api.delete(`${endpoint}/${id}`).then((r) => r.data),
  };
}

export const clientesService = createCRUDService('/people');
export const produtosService = createCRUDService('/products');
export const vendasService = createCRUDService('/sales');
export const financeiroService = createCRUDService('/financial/transactions');

// Dashboard stats
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats').then((r) => r.data),
};

// User/Profile
export const userService = {
  getMe: () => api.get('/users/me').then((r) => r.data),
  updateProfile: (data: any) => api.put('/users/me', data).then((r) => r.data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }).then((r) => r.data),
};

// Config / Tenant
export const configService = {
  getTenantConfig: () => api.get('/tenants/me').then((r) => r.data),
  updateTenantConfig: (data: any) => api.put('/tenants/me', data).then((r) => r.data),
};