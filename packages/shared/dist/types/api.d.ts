import type { UUID } from './models';
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    cursor?: string;
}
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
        nextCursor?: string;
    };
}
export interface ApiResponse<T> {
    data: T;
    message?: string;
    timestamp: string;
}
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, string[]>;
    timestamp: string;
    path: string;
}
export interface BaseFilters extends PaginationParams {
    tenantId?: UUID;
    status?: string;
    startDate?: string;
    endDate?: string;
    userId?: UUID;
    tags?: string[];
}
export interface SaleFilters extends BaseFilters {
    customerId?: UUID;
    paymentMethod?: string;
    minAmount?: number;
    maxAmount?: number;
}
export interface TransactionFilters extends BaseFilters {
    accountId?: UUID;
    category?: string;
    subcategory?: string;
    personId?: UUID;
}
export interface StockFilters extends BaseFilters {
    productId?: UUID;
    type?: string;
    lowStock?: boolean;
}
export interface PersonFilters extends BaseFilters {
    type?: 'fisica' | 'juridica';
    isCustomer?: boolean;
    isSupplier?: boolean;
    document?: string;
}
export interface ProductFilters extends BaseFilters {
    categoryId?: UUID;
    isService?: boolean;
    isActive?: boolean;
    minPrice?: number;
    maxPrice?: number;
    barcode?: string;
}
export interface LoginRequest {
    email: string;
    password: string;
    tenantId?: UUID;
}
export interface LoginResponse {
    user: {
        id: UUID;
        name: string;
        email: string;
        avatar?: string;
        role: string;
        tenantId: UUID;
        tenantName: string;
    };
    tokens: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    };
    tenants: {
        id: UUID;
        name: string;
        businessType: string;
    }[];
}
export interface RefreshTokenRequest {
    refreshToken: string;
}
export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
export interface ResetPasswordRequest {
    email: string;
}
export interface ResetPasswordConfirmRequest {
    token: string;
    newPassword: string;
}
export interface CreateRequest<T> {
    data: T;
}
export interface UpdateRequest<T> {
    data: Partial<T>;
}
export interface DeleteRequest {
    id: UUID;
    soft?: boolean;
}
export interface BatchOperationRequest {
    ids: UUID[];
    action: 'delete' | 'archive' | 'activate' | 'deactivate';
}
export interface DashboardStats {
    period: {
        start: string;
        end: string;
    };
    revenue: number;
    expenses: number;
    profit: number;
    salesCount: number;
    averageTicket: number;
    newCustomers: number;
    topProducts: {
        productId: UUID;
        productName: string;
        quantity: number;
        revenue: number;
    }[];
    revenueByDay: {
        date: string;
        amount: number;
    }[];
    expensesByCategory: {
        category: string;
        amount: number;
    }[];
}
export interface WidgetConfig {
    id: string;
    type: 'stats' | 'chart' | 'list' | 'table' | 'calendar' | 'gauge';
    title: string;
    size: 'small' | 'medium' | 'large' | 'full';
    position: number;
    config: Record<string, unknown>;
}
export interface InstallerConfig {
    type: 'server' | 'station';
}
export interface ServerInstallResult {
    success: boolean;
    ip: string;
    adminUser: string;
    adminPassword: string;
    status: string;
    steps: {
        postgresql: boolean;
        database: boolean;
        migrations: boolean;
        seed: boolean;
        admin: boolean;
        firewall: boolean;
        service: boolean;
    };
}
export interface StationInstallResult {
    success: boolean;
    serverConnection: boolean;
    configDownloaded: boolean;
    status: string;
}
export interface BackupConfig {
    frequency: 'diario' | 'semanal' | 'mensal' | 'manual';
    time: string;
    day?: number;
    retention: number;
    includeFiles: boolean;
    destination?: string;
}
export interface RestoreRequest {
    backupId: UUID;
    confirmRestore: boolean;
}
export interface WSMessage<T = unknown> {
    type: string;
    event: string;
    tenantId: UUID;
    data: T;
    timestamp: string;
}
export interface NotificationMessage {
    id: UUID;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    action?: {
        label: string;
        url: string;
    };
    read: boolean;
    createdAt: string;
}
//# sourceMappingURL=api.d.ts.map