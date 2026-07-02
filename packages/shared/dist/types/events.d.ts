import type { UUID } from './models';
/**
 * Base para todos os eventos de domínio.
 */
export interface DomainEvent {
    /** Tipo do evento */
    eventType: string;
    /** ID do tenant (empresa) */
    tenantId: UUID;
    /** ID do usuário que disparou */
    userId: UUID;
    /** Timestamp ISO */
    timestamp: string;
    /** Dados do evento */
    payload: unknown;
    /** ID de correlação (para tracing) */
    correlationId?: string;
}
export interface TenantCreatedEvent extends DomainEvent {
    eventType: 'tenant.created';
    payload: {
        tenantId: UUID;
        tenantName: string;
        businessType: string;
        adminUserId: UUID;
    };
}
export interface TenantUpdatedEvent extends DomainEvent {
    eventType: 'tenant.updated';
    payload: {
        tenantId: UUID;
        changes: Record<string, unknown>;
    };
}
export interface UserLoginEvent extends DomainEvent {
    eventType: 'user.login';
    payload: {
        userId: UUID;
        ip: string;
    };
}
export interface UserCreatedEvent extends DomainEvent {
    eventType: 'user.created';
    payload: {
        userId: UUID;
        userEmail: string;
        role: string;
    };
}
export interface UserPermissionChangedEvent extends DomainEvent {
    eventType: 'user.permission_changed';
    payload: {
        userId: UUID;
        oldRole: string;
        newRole: string;
    };
}
export interface SaleCreatedEvent extends DomainEvent {
    eventType: 'sale.created';
    payload: {
        saleId: UUID;
        amount: number;
        customerId?: UUID;
        items: Array<{
            productId: UUID;
            quantity: number;
        }>;
    };
}
export interface SaleCompletedEvent extends DomainEvent {
    eventType: 'sale.completed';
    payload: {
        saleId: UUID;
        amount: number;
        paymentMethod: string;
        firstSale?: boolean;
    };
}
export interface SaleCancelledEvent extends DomainEvent {
    eventType: 'sale.cancelled';
    payload: {
        saleId: UUID;
        reason: string;
        restoredStock: boolean;
    };
}
export interface StockLowEvent extends DomainEvent {
    eventType: 'stock.low';
    payload: {
        productId: UUID;
        productName: string;
        currentStock: number;
        minStock: number;
    };
}
export interface StockMovementEvent extends DomainEvent {
    eventType: 'stock.movement';
    payload: {
        movementId: UUID;
        productId: UUID;
        type: string;
        quantity: number;
        previousStock: number;
        newStock: number;
    };
}
export interface TransactionCreatedEvent extends DomainEvent {
    eventType: 'finance.transaction_created';
    payload: {
        transactionId: UUID;
        category: string;
        amount: number;
        dueDate: string;
        firstExpense?: boolean;
    };
}
export interface TransactionPaidEvent extends DomainEvent {
    eventType: 'finance.transaction_paid';
    payload: {
        transactionId: UUID;
        amount: number;
        paidAt: string;
    };
}
export interface AccountBalanceChangedEvent extends DomainEvent {
    eventType: 'finance.balance_changed';
    payload: {
        accountId: UUID;
        previousBalance: number;
        newBalance: number;
        difference: number;
    };
}
export interface ProductCreatedEvent extends DomainEvent {
    eventType: 'product.created';
    payload: {
        productId: UUID;
        productName: string;
        firstProduct?: boolean;
    };
}
export interface ProductPriceChangedEvent extends DomainEvent {
    eventType: 'product.price_changed';
    payload: {
        productId: UUID;
        oldPrice: number;
        newPrice: number;
    };
}
export interface PersonCreatedEvent extends DomainEvent {
    eventType: 'person.created';
    payload: {
        personId: UUID;
        personType: string;
        isCustomer: boolean;
        isSupplier: boolean;
        firstCustomer?: boolean;
        firstSupplier?: boolean;
    };
}
export interface BackupCreatedEvent extends DomainEvent {
    eventType: 'system.backup_created';
    payload: {
        backupId: UUID;
        filename: string;
        size: number;
        type: string;
    };
}
export interface BackupRestoredEvent extends DomainEvent {
    eventType: 'system.backup_restored';
    payload: {
        backupId: UUID;
        restoredAt: string;
        success: boolean;
    };
}
export interface UpdateAppliedEvent extends DomainEvent {
    eventType: 'system.update_applied';
    payload: {
        version: string;
        previousVersion: string;
        appliedAt: string;
    };
}
export interface UserMilestoneEvent extends DomainEvent {
    eventType: 'user.milestone';
    payload: {
        userId: UUID;
        milestone: string;
        points: number;
        newLevel: string;
    };
}
export interface TourCompletedEvent extends DomainEvent {
    eventType: 'user.tour_completed';
    payload: {
        userId: UUID;
        tourId: string;
        tourName: string;
    };
}
export interface KnowledgeQuestionEvent extends DomainEvent {
    eventType: 'assistant.question';
    payload: {
        userId: UUID;
        question: string;
        intent: string;
        resolved: boolean;
        tourTriggered?: string;
    };
}
/**
 * Mapa que associa cada tipo de evento ao seu payload.
 * Útil para tipagem forte nos handlers do NestJS.
 */
export interface EventMap {
    'tenant.created': TenantCreatedEvent;
    'tenant.updated': TenantUpdatedEvent;
    'user.login': UserLoginEvent;
    'user.created': UserCreatedEvent;
    'user.permission_changed': UserPermissionChangedEvent;
    'sale.created': SaleCreatedEvent;
    'sale.completed': SaleCompletedEvent;
    'sale.cancelled': SaleCancelledEvent;
    'stock.low': StockLowEvent;
    'stock.movement': StockMovementEvent;
    'finance.transaction_created': TransactionCreatedEvent;
    'finance.transaction_paid': TransactionPaidEvent;
    'finance.balance_changed': AccountBalanceChangedEvent;
    'product.created': ProductCreatedEvent;
    'product.price_changed': ProductPriceChangedEvent;
    'person.created': PersonCreatedEvent;
    'system.backup_created': BackupCreatedEvent;
    'system.backup_restored': BackupRestoredEvent;
    'system.update_applied': UpdateAppliedEvent;
    'user.milestone': UserMilestoneEvent;
    'user.tour_completed': TourCompletedEvent;
    'assistant.question': KnowledgeQuestionEvent;
}
export type EventName = keyof EventMap;
export type EventPayload<E extends EventName> = EventMap[E];
//# sourceMappingURL=events.d.ts.map