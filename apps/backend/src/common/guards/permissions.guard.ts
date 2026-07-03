import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const PERMISSIONS_KEY = 'permissions';

export interface RequiredPermission {
  action: string;
  resource: string;
}

export const RequirePermissions = (...permissions: { action: string; resource: string }[]) => {
  return (target: any, key?: string, descriptor?: any) => {
    if (descriptor) {
      Reflect.defineMetadata(PERMISSIONS_KEY, permissions, descriptor.value);
      return descriptor;
    }
    Reflect.defineMetadata(PERMISSIONS_KEY, permissions, target);
    return target;
  };
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<RequiredPermission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.permissions) return false;

    return required.every(p =>
      user.permissions.some(
        (up: any) => up.action === p.action && up.resource === p.resource,
      ),
    );
  }
}

export const Permissions = {
  SALES_VIEW: { action: 'view', resource: 'sales' },
  SALES_CREATE: { action: 'create', resource: 'sales' },
  SALES_APPROVE: { action: 'approve', resource: 'sales' },
  SALES_CANCEL: { action: 'cancel', resource: 'sales' },
  CLIENTS_VIEW: { action: 'view', resource: 'clients' },
  CLIENTS_CREATE: { action: 'create', resource: 'clients' },
  CLIENTS_EDIT: { action: 'edit', resource: 'clients' },
  CLIENTS_DELETE: { action: 'delete', resource: 'clients' },
  PRODUCTS_VIEW: { action: 'view', resource: 'products' },
  PRODUCTS_CREATE: { action: 'create', resource: 'products' },
  PRODUCTS_EDIT: { action: 'edit', resource: 'products' },
  PRODUCTS_DELETE: { action: 'delete', resource: 'products' },
  FINANCIAL_VIEW: { action: 'view', resource: 'financial' },
  FINANCIAL_CREATE: { action: 'create', resource: 'financial' },
  FINANCIAL_MANAGE: { action: 'manage', resource: 'financial' },
  STOCK_VIEW: { action: 'view', resource: 'stock' },
  STOCK_MANAGE: { action: 'manage', resource: 'stock' },
  SUPPLIERS_VIEW: { action: 'view', resource: 'suppliers' },
  SUPPLIERS_MANAGE: { action: 'manage', resource: 'suppliers' },
  PURCHASES_VIEW: { action: 'view', resource: 'purchases' },
  PURCHASES_CREATE: { action: 'create', resource: 'purchases' },
  PURCHASES_APPROVE: { action: 'approve', resource: 'purchases' },
  REPORTS_VIEW: { action: 'view', resource: 'reports' },
  USERS_VIEW: { action: 'view', resource: 'users' },
  USERS_MANAGE: { action: 'manage', resource: 'users' },
  SETTINGS_MANAGE: { action: 'manage', resource: 'settings' },
  BACKUP_MANAGE: { action: 'manage', resource: 'backup' },
};

export const rolePermissions: Record<string, { action: string; resource: string }[]> = {
  admin: [{ action: '*', resource: '*' }],
  gerente: [
    Permissions.SALES_VIEW, Permissions.SALES_CREATE, Permissions.SALES_APPROVE,
    Permissions.CLIENTS_VIEW, Permissions.CLIENTS_CREATE, Permissions.CLIENTS_EDIT, Permissions.CLIENTS_DELETE,
    Permissions.PRODUCTS_VIEW, Permissions.PRODUCTS_CREATE, Permissions.PRODUCTS_EDIT, Permissions.PRODUCTS_DELETE,
    Permissions.FINANCIAL_VIEW, Permissions.FINANCIAL_CREATE, Permissions.FINANCIAL_MANAGE,
    Permissions.STOCK_VIEW, Permissions.STOCK_MANAGE,
    Permissions.SUPPLIERS_VIEW, Permissions.SUPPLIERS_MANAGE,
    Permissions.PURCHASES_VIEW, Permissions.PURCHASES_CREATE, Permissions.PURCHASES_APPROVE,
    Permissions.REPORTS_VIEW, Permissions.USERS_VIEW,
    Permissions.SETTINGS_MANAGE, Permissions.BACKUP_MANAGE,
  ],
  operador: [
    Permissions.SALES_VIEW, Permissions.SALES_CREATE,
    Permissions.CLIENTS_VIEW, Permissions.CLIENTS_CREATE, Permissions.CLIENTS_EDIT,
    Permissions.PRODUCTS_VIEW,
    Permissions.FINANCIAL_VIEW,
    Permissions.STOCK_VIEW, Permissions.SUPPLIERS_VIEW,
    Permissions.PURCHASES_VIEW, Permissions.REPORTS_VIEW,
  ],
  leitura: [
    Permissions.SALES_VIEW, Permissions.CLIENTS_VIEW, Permissions.PRODUCTS_VIEW,
    Permissions.FINANCIAL_VIEW, Permissions.STOCK_VIEW,
    Permissions.SUPPLIERS_VIEW, Permissions.PURCHASES_VIEW, Permissions.REPORTS_VIEW,
  ],
};