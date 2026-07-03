import { useAuthStore } from '@/stores/auth.store';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'cancel' | 'manage';
export type PermissionResource = 'sales' | 'clients' | 'products' | 'financial' | 'stock' | 'suppliers' | 'purchases' | 'reports' | 'users' | 'settings' | 'backup';
export type Role = 'admin' | 'gerente' | 'operador' | 'leitura';

const rolePermissionsMap: Record<Role, string[]> = {
  admin: ['*'],
  gerente: [
    'sales:view', 'sales:create', 'sales:approve',
    'clients:view', 'clients:create', 'clients:edit', 'clients:delete',
    'products:view', 'products:create', 'products:edit', 'products:delete',
    'financial:view', 'financial:create', 'financial:manage',
    'stock:view', 'stock:manage',
    'suppliers:view', 'suppliers:manage',
    'purchases:view', 'purchases:create', 'purchases:approve',
    'reports:view', 'users:view',
    'settings:manage', 'backup:manage',
  ],
  operador: [
    'sales:view', 'sales:create',
    'clients:view', 'clients:create', 'clients:edit',
    'products:view', 'financial:view',
    'stock:view', 'suppliers:view',
    'purchases:view', 'reports:view',
  ],
  leitura: [
    'sales:view', 'clients:view', 'products:view',
    'financial:view', 'stock:view',
    'suppliers:view', 'purchases:view', 'reports:view',
  ],
};

function hasPermission(role: string, action: string, resource: string): boolean {
  const perms = rolePermissionsMap[role as Role] || [];
  if (perms.includes('*')) return true;
  return perms.includes(`${resource}:${action}`);
}

export function usePermissions() {
  const user = useAuthStore(s => s.user);
  const role = (user?.role || 'operador') as Role;

  return {
    role,
    can: (action: PermissionAction, resource: PermissionResource): boolean => {
      return hasPermission(role, action, resource);
    },
    canView: (resource: PermissionResource) => hasPermission(role, 'view', resource),
    canCreate: (resource: PermissionResource) => hasPermission(role, 'create', resource),
    canEdit: (resource: PermissionResource) => hasPermission(role, 'edit', resource),
    canDelete: (resource: PermissionResource) => hasPermission(role, 'delete', resource),
    canApprove: (resource: PermissionResource) => hasPermission(role, 'approve', resource),
    canManage: (resource: PermissionResource) => hasPermission(role, 'manage', resource),
    isAdmin: role === 'admin',
    isManager: role === 'gerente',
    isOperator: role === 'operador',
    isReadOnly: role === 'leitura',
  };
}