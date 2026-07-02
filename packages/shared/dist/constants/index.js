// ──── Constantes do ERP ────
import { BusinessType, SystemModule } from '../enums';
/** Versão atual do sistema */
export const APP_VERSION = '1.0.0';
/** Nome do sistema */
export const APP_NAME = 'Ferramenta ERP';
/** Descrição curta */
export const APP_DESCRIPTION = 'Gestão Empresarial Inteligente';
/** Porta padrão do servidor */
export const DEFAULT_SERVER_PORT = 3000;
/** Porta padrão WebSocket */
export const DEFAULT_WS_PORT = 3001;
/** Prefixo da API */
export const API_PREFIX = '/api/v1';
/** Tamanho máximo de upload (50MB) */
export const MAX_UPLOAD_SIZE = 50 * 1024 * 1024;
/** Tempo de expiração do token JWT (15 minutos) */
export const JWT_EXPIRATION = '15m';
/** Tempo de expiração do refresh token (7 dias) */
export const REFRESH_TOKEN_EXPIRATION = '7d';
/** Tentativas máximas de login antes de bloqueio */
export const MAX_LOGIN_ATTEMPTS = 5;
/** Tempo de bloqueio após exceder tentativas (minutos) */
export const LOCKOUT_DURATION_MINUTES = 30;
/** Itens por página padrão */
export const DEFAULT_PAGE_SIZE = 20;
/** Tamanhos de página disponíveis */
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
/** Formatos de moeda */
export const CURRENCY_CONFIG = {
    BRL: {
        symbol: 'R$',
        locale: 'pt-BR',
        decimals: 2,
    },
    USD: {
        symbol: '$',
        locale: 'en-US',
        decimals: 2,
    },
    EUR: {
        symbol: '€',
        locale: 'de-DE',
        decimals: 2,
    },
};
/** Configurações de tema */
export const THEME_CONFIG = {
    light: {
        background: 'bg-white',
        surface: 'bg-gray-50',
        surfaceHover: 'hover:bg-gray-100',
        border: 'border-gray-200',
        text: 'text-gray-900',
        textSecondary: 'text-gray-500',
        shadow: 'shadow-sm',
    },
    dark: {
        background: 'bg-gray-950',
        surface: 'bg-gray-900',
        surfaceHover: 'hover:bg-gray-800',
        border: 'border-gray-800',
        text: 'text-gray-100',
        textSecondary: 'text-gray-400',
        shadow: 'shadow-sm shadow-gray-900',
    },
};
/** Espaçamento do design system (base 4px) */
export const SPACING = {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
};
/** Breakpoints */
export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};
/** Animações padrão (Framer Motion) */
export const ANIMATIONS = {
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
    slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    },
    slideRight: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
    },
    scale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
    },
    spring: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
    },
    gentle: {
        type: 'spring',
        stiffness: 200,
        damping: 25,
    },
};
/** Status com cores (para badges) */
export const STATUS_COLORS = {
    ativo: {
        bg: 'bg-emerald-50 dark:bg-emerald-950',
        text: 'text-emerald-700 dark:text-emerald-300',
        dot: 'bg-emerald-500',
    },
    inativo: {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-600 dark:text-gray-400',
        dot: 'bg-gray-400',
    },
    pendente: {
        bg: 'bg-amber-50 dark:bg-amber-950',
        text: 'text-amber-700 dark:text-amber-300',
        dot: 'bg-amber-500',
    },
    bloqueado: {
        bg: 'bg-red-50 dark:bg-red-950',
        text: 'text-red-700 dark:text-red-300',
        dot: 'bg-red-500',
    },
    pago: {
        bg: 'bg-emerald-50 dark:bg-emerald-950',
        text: 'text-emerald-700 dark:text-emerald-300',
        dot: 'bg-emerald-500',
    },
    atrasado: {
        bg: 'bg-red-50 dark:bg-red-950',
        text: 'text-red-700 dark:text-red-300',
        dot: 'bg-red-500',
    },
    cancelado: {
        bg: 'bg-red-50 dark:bg-red-950',
        text: 'text-red-500 dark:text-red-400',
        dot: 'bg-red-400',
    },
    entregue: {
        bg: 'bg-blue-50 dark:bg-blue-950',
        text: 'text-blue-700 dark:text-blue-300',
        dot: 'bg-blue-500',
    },
};
/** Configurações iniciais dos segmentos de negócio */
export const BUSINESS_TYPE_DEFAULTS = {
    [BusinessType.LOJA]: {
        primaryColor: '#2563eb',
        secondaryColor: '#7c3aed',
        gradient: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        icon: 'Store',
        label: 'Loja',
        description: 'Varejo e comércio em geral',
    },
    [BusinessType.CLINICA]: {
        primaryColor: '#0891b2',
        secondaryColor: '#0d9488',
        gradient: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
        icon: 'Stethoscope',
        label: 'Clínica',
        description: 'Consultórios e clínicas médicas',
    },
    [BusinessType.RESTAURANTE]: {
        primaryColor: '#dc2626',
        secondaryColor: '#ea580c',
        gradient: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
        icon: 'Utensils',
        label: 'Restaurante',
        description: 'Bares, restaurantes e delivery',
    },
    [BusinessType.DISTRIBUIDORA]: {
        primaryColor: '#7c3aed',
        secondaryColor: '#2563eb',
        gradient: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
        icon: 'Truck',
        label: 'Distribuidora',
        description: 'Atacado e distribuição',
    },
    [BusinessType.PRESTADORA_SERVICO]: {
        primaryColor: '#059669',
        secondaryColor: '#0891b2',
        gradient: 'linear-gradient(135deg, #059669 0%, #0891b2 100%)',
        icon: 'Briefcase',
        label: 'Prestadora de Serviço',
        description: 'Serviços profissionais',
    },
    [BusinessType.BUFFET]: {
        primaryColor: '#d946ef',
        secondaryColor: '#f59e0b',
        gradient: 'linear-gradient(135deg, #d946ef 0%, #f59e0b 100%)',
        icon: 'PartyPopper',
        label: 'Buffet',
        description: 'Eventos e festas',
    },
    [BusinessType.AUTOPECAS]: {
        primaryColor: '#52525b',
        secondaryColor: '#3f3f46',
        gradient: 'linear-gradient(135deg, #52525b 0%, #3f3f46 100%)',
        icon: 'Wrench',
        label: 'Autopeças',
        description: 'Peças e acessórios automotivos',
    },
    [BusinessType.OFICINA]: {
        primaryColor: '#ca8a04',
        secondaryColor: '#a16207',
        gradient: 'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)',
        icon: 'Settings',
        label: 'Oficina',
        description: 'Oficinas mecânicas e reparos',
    },
    [BusinessType.ESCRITORIO]: {
        primaryColor: '#4f46e5',
        secondaryColor: '#6366f1',
        gradient: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
        icon: 'Building2',
        label: 'Escritório',
        description: 'Escritórios administrativos',
    },
    [BusinessType.HOTEL]: {
        primaryColor: '#b45309',
        secondaryColor: '#d97706',
        gradient: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
        icon: 'Hotel',
        label: 'Hotel',
        description: 'Hotéis, pousadas e hospedagem',
    },
    [BusinessType.IMOBILIARIA]: {
        primaryColor: '#0f766e',
        secondaryColor: '#115e59',
        gradient: 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)',
        icon: 'Home',
        label: 'Imobiliária',
        description: 'Imóveis e locações',
    },
    [BusinessType.ACADEMIA]: {
        primaryColor: '#db2777',
        secondaryColor: '#e11d48',
        gradient: 'linear-gradient(135deg, #db2777 0%, #e11d48 100%)',
        icon: 'Dumbbell',
        label: 'Academia',
        description: 'Academias e centros fitness',
    },
    [BusinessType.PET_SHOP]: {
        primaryColor: '#0284c7',
        secondaryColor: '#0369a1',
        gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        icon: 'PawPrint',
        label: 'Pet Shop',
        description: 'Produtos e serviços para pets',
    },
    [BusinessType.MERCADO]: {
        primaryColor: '#16a34a',
        secondaryColor: '#15803d',
        gradient: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
        icon: 'ShoppingCart',
        label: 'Mercado',
        description: 'Mercados e supermercados',
    },
    [BusinessType.FARMACIA]: {
        primaryColor: '#0891b2',
        secondaryColor: '#0e7490',
        gradient: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
        icon: 'Pill',
        label: 'Farmácia',
        description: 'Farmácias e drogarias',
    },
    [BusinessType.CONSTRUTORA]: {
        primaryColor: '#c2410c',
        secondaryColor: '#9a3412',
        gradient: 'linear-gradient(135deg, #c2410c 0%, #9a3412 100%)',
        icon: 'Hammer',
        label: 'Construtora',
        description: 'Construção civil e obras',
    },
    [BusinessType.TRANSPORTADORA]: {
        primaryColor: '#1d4ed8',
        secondaryColor: '#1e40af',
        gradient: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
        icon: 'Truck',
        label: 'Transportadora',
        description: 'Transporte e logística',
    },
};
/** Módulos base (comuns a todos os segmentos) */
export const CORE_MODULES = [
    SystemModule.DASHBOARD,
    SystemModule.CLIENTES,
    SystemModule.FORNECEDORES,
    SystemModule.PRODUTOS,
    SystemModule.FINANCEIRO,
    SystemModule.CONTAS_PAGAR,
    SystemModule.CONTAS_RECEBER,
    SystemModule.FLUXO_CAIXA,
    SystemModule.ESTOQUE,
    SystemModule.VENDAS,
    SystemModule.PDV,
    SystemModule.ORCAMENTOS,
    SystemModule.COMPRAS,
    SystemModule.RELATORIOS,
    SystemModule.CONFIGURACOES,
    SystemModule.USUARIOS,
];
/** Atalhos de teclado globais */
export const GLOBAL_SHORTCUTS = {
    'ctrl+k': 'Busca rápida / Comandos',
    'ctrl+n': 'Novo registro rápido',
    'ctrl+s': 'Salvar',
    'ctrl+d': 'Dashboard',
    'ctrl+1': 'Clientes',
    'ctrl+2': 'Produtos',
    'ctrl+3': 'Financeiro',
    'ctrl+4': 'Vendas',
    'ctrl+5': 'Estoque',
    'ctrl+6': 'Relatórios',
    'ctrl+,': 'Configurações',
    'esc': 'Fechar / Voltar',
};
/** Mensagens de erro padrão */
export const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Você não tem permissão para acessar este recurso.',
    SESSION_EXPIRED: 'Sua sessão expirou. Faça login novamente.',
    NETWORK_ERROR: 'Erro de conexão. Verifique sua rede.',
    SERVER_ERROR: 'Erro interno do servidor. Tente novamente.',
    VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
    NOT_FOUND: 'Recurso não encontrado.',
    DUPLICATE: 'Registro já existe.',
    INSUFFICIENT_STOCK: 'Estoque insuficiente.',
    INVALID_CREDENTIALS: 'Email ou senha inválidos.',
    ACCOUNT_LOCKED: 'Conta bloqueada. Tente novamente mais tarde.',
    TENANT_REQUIRED: 'Selecione uma empresa para continuar.',
};
/** Mensagens de sucesso padrão */
export const SUCCESS_MESSAGES = {
    CREATED: 'Registro criado com sucesso!',
    UPDATED: 'Registro atualizado com sucesso!',
    DELETED: 'Registro excluído com sucesso!',
    SAVED: 'Alterações salvas com sucesso!',
    EXPORTED: 'Dados exportados com sucesso!',
    IMPORTED: 'Dados importados com sucesso!',
    BACKUP_CREATED: 'Backup criado com sucesso!',
    BACKUP_RESTORED: 'Backup restaurado com sucesso!',
};
//# sourceMappingURL=index.js.map