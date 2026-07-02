import { BusinessType, SystemModule } from '../enums';
import type { BusinessTypeConfig } from '../types/business-types';
/** Versão atual do sistema */
export declare const APP_VERSION = "1.0.0";
/** Nome do sistema */
export declare const APP_NAME = "Ferramenta ERP";
/** Descrição curta */
export declare const APP_DESCRIPTION = "Gest\u00E3o Empresarial Inteligente";
/** Porta padrão do servidor */
export declare const DEFAULT_SERVER_PORT = 3000;
/** Porta padrão WebSocket */
export declare const DEFAULT_WS_PORT = 3001;
/** Prefixo da API */
export declare const API_PREFIX = "/api/v1";
/** Tamanho máximo de upload (50MB) */
export declare const MAX_UPLOAD_SIZE: number;
/** Tempo de expiração do token JWT (15 minutos) */
export declare const JWT_EXPIRATION = "15m";
/** Tempo de expiração do refresh token (7 dias) */
export declare const REFRESH_TOKEN_EXPIRATION = "7d";
/** Tentativas máximas de login antes de bloqueio */
export declare const MAX_LOGIN_ATTEMPTS = 5;
/** Tempo de bloqueio após exceder tentativas (minutos) */
export declare const LOCKOUT_DURATION_MINUTES = 30;
/** Itens por página padrão */
export declare const DEFAULT_PAGE_SIZE = 20;
/** Tamanhos de página disponíveis */
export declare const PAGE_SIZE_OPTIONS: number[];
/** Formatos de moeda */
export declare const CURRENCY_CONFIG: {
    BRL: {
        symbol: string;
        locale: string;
        decimals: number;
    };
    USD: {
        symbol: string;
        locale: string;
        decimals: number;
    };
    EUR: {
        symbol: string;
        locale: string;
        decimals: number;
    };
};
/** Configurações de tema */
export declare const THEME_CONFIG: {
    light: {
        background: string;
        surface: string;
        surfaceHover: string;
        border: string;
        text: string;
        textSecondary: string;
        shadow: string;
    };
    dark: {
        background: string;
        surface: string;
        surfaceHover: string;
        border: string;
        text: string;
        textSecondary: string;
        shadow: string;
    };
};
/** Espaçamento do design system (base 4px) */
export declare const SPACING: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    10: string;
    12: string;
    16: string;
    20: string;
    24: string;
};
/** Breakpoints */
export declare const BREAKPOINTS: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
};
/** Animações padrão (Framer Motion) */
export declare const ANIMATIONS: {
    fadeIn: {
        initial: {
            opacity: number;
        };
        animate: {
            opacity: number;
        };
        exit: {
            opacity: number;
        };
    };
    slideUp: {
        initial: {
            opacity: number;
            y: number;
        };
        animate: {
            opacity: number;
            y: number;
        };
        exit: {
            opacity: number;
            y: number;
        };
    };
    slideRight: {
        initial: {
            opacity: number;
            x: number;
        };
        animate: {
            opacity: number;
            x: number;
        };
        exit: {
            opacity: number;
            x: number;
        };
    };
    scale: {
        initial: {
            opacity: number;
            scale: number;
        };
        animate: {
            opacity: number;
            scale: number;
        };
        exit: {
            opacity: number;
            scale: number;
        };
    };
    spring: {
        type: "spring";
        stiffness: number;
        damping: number;
    };
    gentle: {
        type: "spring";
        stiffness: number;
        damping: number;
    };
};
/** Status com cores (para badges) */
export declare const STATUS_COLORS: {
    ativo: {
        bg: string;
        text: string;
        dot: string;
    };
    inativo: {
        bg: string;
        text: string;
        dot: string;
    };
    pendente: {
        bg: string;
        text: string;
        dot: string;
    };
    bloqueado: {
        bg: string;
        text: string;
        dot: string;
    };
    pago: {
        bg: string;
        text: string;
        dot: string;
    };
    atrasado: {
        bg: string;
        text: string;
        dot: string;
    };
    cancelado: {
        bg: string;
        text: string;
        dot: string;
    };
    entregue: {
        bg: string;
        text: string;
        dot: string;
    };
};
/** Configurações iniciais dos segmentos de negócio */
export declare const BUSINESS_TYPE_DEFAULTS: Record<BusinessType, Partial<BusinessTypeConfig>>;
/** Módulos base (comuns a todos os segmentos) */
export declare const CORE_MODULES: SystemModule[];
/** Atalhos de teclado globais */
export declare const GLOBAL_SHORTCUTS: {
    'ctrl+k': string;
    'ctrl+n': string;
    'ctrl+s': string;
    'ctrl+d': string;
    'ctrl+1': string;
    'ctrl+2': string;
    'ctrl+3': string;
    'ctrl+4': string;
    'ctrl+5': string;
    'ctrl+6': string;
    'ctrl+,': string;
    esc: string;
};
/** Mensagens de erro padrão */
export declare const ERROR_MESSAGES: {
    UNAUTHORIZED: string;
    SESSION_EXPIRED: string;
    NETWORK_ERROR: string;
    SERVER_ERROR: string;
    VALIDATION_ERROR: string;
    NOT_FOUND: string;
    DUPLICATE: string;
    INSUFFICIENT_STOCK: string;
    INVALID_CREDENTIALS: string;
    ACCOUNT_LOCKED: string;
    TENANT_REQUIRED: string;
};
/** Mensagens de sucesso padrão */
export declare const SUCCESS_MESSAGES: {
    CREATED: string;
    UPDATED: string;
    DELETED: string;
    SAVED: string;
    EXPORTED: string;
    IMPORTED: string;
    BACKUP_CREATED: string;
    BACKUP_RESTORED: string;
};
//# sourceMappingURL=index.d.ts.map