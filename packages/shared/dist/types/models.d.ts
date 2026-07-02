import type { EntityStatus, PersonType, Gender, AddressType, ContactType, UnitOfMeasure, StockMovementType, SaleStatus, PaymentMethod, PaymentStatus, AccountType, TransactionCategory, TransactionSubcategory, SystemRole, SystemModule, BusinessType, TaxRegime, BrazilianState, AuditAction } from '../enums';
export type UUID = string;
export type ISODate = string;
export type JSONObject = Record<string, unknown>;
export interface Money {
    amount: number;
    currency: string;
}
export interface Address {
    id?: UUID;
    type: AddressType;
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: BrazilianState;
    country: string;
    isDefault: boolean;
}
export interface Contact {
    id?: UUID;
    type: ContactType;
    value: string;
    label?: string;
    isDefault: boolean;
}
export interface Document {
    id?: UUID;
    type: 'cpf' | 'cnpj' | 'rg' | 'ie' | 'im' | 'outro';
    value: string;
}
export interface Tenant {
    id: UUID;
    name: string;
    fantasyName?: string;
    document?: string;
    businessType: BusinessType;
    taxRegime: TaxRegime;
    status: EntityStatus;
    logo?: string;
    primaryColor?: string;
    config: TenantConfig;
    address?: Address;
    contacts: Contact[];
    createdAt: ISODate;
    updatedAt: ISODate;
}
export interface TenantConfig {
    timezone: string;
    language: string;
    currency: string;
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
    decimalSeparator: ',' | '.';
    modules: SystemModule[];
    features: Record<string, boolean>;
    notifications: {
        email: boolean;
        push: boolean;
        desktop: boolean;
    };
    backup: {
        frequency: 'diario' | 'semanal' | 'mensal';
        retention: number;
        autoBackup: boolean;
    };
}
export interface User {
    id: UUID;
    tenantId: UUID;
    name: string;
    email: string;
    avatar?: string;
    role: SystemRole;
    experienceLevel: 'iniciante' | 'intermediario' | 'avancado' | 'especialista';
    status: EntityStatus;
    preferences: UserPreferences;
    lastLoginAt?: ISODate;
    createdAt: ISODate;
    updatedAt: ISODate;
}
export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    sidebarCollapsed: boolean;
    language: string;
    completedTours: string[];
    dismissedTips: string[];
    quickActions: string[];
    dashboardWidgets: string[];
    notifications: boolean;
}
export interface Role {
    id: UUID;
    tenantId: UUID;
    name: string;
    description?: string;
    isSystem: boolean;
    permissions: Permission[];
    createdAt: ISODate;
    updatedAt: ISODate;
}
export interface Permission {
    id: UUID;
    roleId: UUID;
    module: SystemModule;
    actions: string[];
    conditions?: JSONObject;
}
export interface Person {
    id: UUID;
    tenantId: UUID;
    type: PersonType;
    name: string;
    fantasyName?: string;
    documents: Document[];
    contacts: Contact[];
    addresses: Address[];
    birthDate?: ISODate;
    gender?: Gender;
    notes?: string;
    tags: string[];
    isSupplier: boolean;
    isCustomer: boolean;
    status: EntityStatus;
    createdAt: ISODate;
    updatedAt: ISODate;
}
export interface Product {
    id: UUID;
    tenantId: UUID;
    code: string;
    barcode?: string;
    name: string;
    description?: string;
    unitOfMeasure: UnitOfMeasure;
    categoryId?: UUID;
    category?: ProductCategory;
    brand?: string;
    costPrice: number;
    sellingPrice: number;
    minStock: number;
    maxStock: number;
    currentStock: number;
    weight?: number;
    dimensions?: {
        width: number;
        height: number;
        depth: number;
    };
    image?: string;
    isService: boolean;
    isActive: boolean;
    tags: string[];
    createdAt: ISODate;
    updatedAt: ISODate;
}
export interface ProductCategory {
    id: UUID;
    tenantId: UUID;
    name: string;
    description?: string;
    parentId?: UUID;
    children?: ProductCategory[];
    createdAt: ISODate;
    updatedAt: ISODate;
}
export interface StockMovement {
    id: UUID;
    tenantId: UUID;
    productId: UUID;
    type: StockMovementType;
    quantity: number;
    unitPrice: number;
    reason?: string;
    referenceId?: UUID;
    referenceType?: string;
    userId: UUID;
    createdAt: ISODate;
}
export interface Sale {
    id: UUID;
    tenantId: UUID;
    number: string;
    customerId?: UUID;
    customer?: Person;
    items: SaleItem[];
    subtotal: number;
    discount: number;
    additions: number;
    total: number;
    status: SaleStatus;
    payments: Payment[];
    notes?: string;
    userId: UUID;
    createdAt: ISODate;
    updatedAt: ISODate;
}
export interface SaleItem {
    id: UUID;
    saleId: UUID;
    productId: UUID;
    product: Product;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
}
export interface Payment {
    id: UUID;
    saleId?: UUID;
    method: PaymentMethod;
    amount: number;
    installments?: number;
    dueDate?: ISODate;
    paidAt?: ISODate;
    status: PaymentStatus;
    notes?: string;
}
export interface FinancialAccount {
    id: UUID;
    tenantId: UUID;
    name: string;
    type: AccountType;
    bank?: string;
    agency?: string;
    account?: string;
    initialBalance: number;
    currentBalance: number;
    isActive: boolean;
    createdAt: ISODate;
    updatedAt: ISODate;
}
export interface FinancialTransaction {
    id: UUID;
    tenantId: UUID;
    accountId: UUID;
    category: TransactionCategory;
    subcategory: TransactionSubcategory;
    description: string;
    amount: number;
    dueDate: ISODate;
    paidAt?: ISODate;
    status: PaymentStatus;
    personId?: UUID;
    person?: Person;
    saleId?: UUID;
    attachments: string[];
    recurrence?: RecurrenceConfig;
    notes?: string;
    userId: UUID;
    createdAt: ISODate;
    updatedAt: ISODate;
}
export interface RecurrenceConfig {
    frequency: 'diario' | 'semanal' | 'mensal' | 'anual';
    interval: number;
    endDate?: ISODate;
    occurrences?: number;
}
export interface AuditLog {
    id: UUID;
    tenantId: UUID;
    userId: UUID;
    user: User;
    action: AuditAction;
    entity: string;
    entityId?: UUID;
    oldValues?: JSONObject;
    newValues?: JSONObject;
    ip?: string;
    userAgent?: string;
    createdAt: ISODate;
}
export interface Backup {
    id: UUID;
    tenantId: UUID;
    filename: string;
    size: number;
    type: 'automatico' | 'manual';
    status: 'pendente' | 'executando' | 'concluido' | 'erro';
    path?: string;
    error?: string;
    createdAt: ISODate;
}
export interface Session {
    id: UUID;
    userId: UUID;
    tenantId: UUID;
    token: string;
    refreshToken: string;
    ip?: string;
    userAgent?: string;
    expiresAt: ISODate;
    createdAt: ISODate;
}
export interface KnowledgeEntry {
    id: UUID;
    intent: string;
    keywords: string[];
    answer: string;
    tourId?: string;
    moduleId?: SystemModule;
    action?: string;
    priority: number;
    createdAt: ISODate;
}
export interface GuidedTour {
    id: string;
    name: string;
    description: string;
    type: 'primeiro_acesso' | 'modulo' | 'funcionalidade';
    targetModule?: SystemModule;
    steps: TourStep[];
    createdAt: ISODate;
}
export interface TourStep {
    order: number;
    target: string;
    title: string;
    content: string;
    placement: 'top' | 'bottom' | 'left' | 'right';
    action?: 'click' | 'input' | 'navigate';
    actionTarget?: string;
    required: boolean;
}
export interface UserProgress {
    id: UUID;
    userId: UUID;
    firstSaleCompleted: boolean;
    firstProductCreated: boolean;
    firstCustomerCreated: boolean;
    firstSupplierCreated: boolean;
    firstExpenseCreated: boolean;
    firstBudgetCreated: boolean;
    completedTours: string[];
    completedTutorials: string[];
    experienceLevel: 'iniciante' | 'intermediario' | 'avancado' | 'especialista';
    points: number;
    createdAt: ISODate;
    updatedAt: ISODate;
}
//# sourceMappingURL=models.d.ts.map