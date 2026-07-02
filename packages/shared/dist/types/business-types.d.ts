import type { SystemModule, BusinessType } from '../enums';
import type { WidgetConfig } from './api';
/**
 * Configuração de um segmento de negócio.
 * Cada segmento define módulos, menus, dashboard e visual.
 */
export interface BusinessTypeConfig {
    /** Tipo de negócio */
    type: BusinessType;
    /** Nome amigável */
    label: string;
    /** Descrição do segmento */
    description: string;
    /** Ícone Lucide */
    icon: string;
    /** Cor primária (hex) */
    primaryColor: string;
    /** Cor secundária (hex) */
    secondaryColor: string;
    /** Gradiente para backgrounds */
    gradient: string;
    /** URL do wallpaper/imagem de fundo para login */
    wallpaper?: string;
    /** Módulos específicos deste segmento */
    modules: BusinessModule[];
    /** Configuração de menus da sidebar */
    menu: MenuConfig[];
    /** Widgets padrão do dashboard */
    dashboard: WidgetConfig[];
    /** Atalhos rápidos */
    quickActions: QuickAction[];
    /** Cadastros específicos */
    customRegisters: CustomRegister[];
    /** Fluxos de trabalho */
    workflows: Workflow[];
    /** Relatórios específicos */
    reports: CustomReport[];
}
export interface BusinessModule {
    /** Código único do módulo */
    module: SystemModule;
    /** Nome de exibição */
    label: string;
    /** Ícone */
    icon: string;
    /** Descrição */
    description: string;
    /** Componente React a carregar (lazy) */
    component: string;
    /** Submódulos */
    children?: BusinessModule[];
}
export interface MenuConfig {
    /** Título da seção */
    section: string;
    /** Ordem */
    order: number;
    /** Itens do menu */
    items: MenuItem[];
    /** Visível apenas para perfis específicos */
    roles?: string[];
}
export interface MenuItem {
    /** Código do módulo */
    module: SystemModule;
    /** Rótulo */
    label: string;
    /** Ícone */
    icon: string;
    /** Rota */
    path: string;
    /** Permissão mínima */
    permission?: string;
    /** Subitens */
    children?: MenuItem[];
    /** Badge (ex: "Novo", contador) */
    badge?: {
        type: 'new' | 'count' | 'alert';
        value?: string;
    };
    /** Atalho de teclado */
    shortcut?: string;
}
export interface QuickAction {
    /** ID único */
    id: string;
    /** Rótulo */
    label: string;
    /** Ícone */
    icon: string;
    /** Rota ou ação */
    action: string;
    /** Atalho de teclado */
    shortcut?: string;
    /** Cor do botão */
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}
export interface CustomRegister {
    /** Nome da entidade */
    entity: string;
    /** Rótulo */
    label: string;
    /** Plural */
    pluralLabel: string;
    /** Ícone */
    icon: string;
    /** Campos personalizados */
    fields: CustomField[];
    /** Abas de detalhe */
    tabs?: DetailTab[];
}
export interface CustomField {
    /** Nome do campo */
    name: string;
    /** Rótulo */
    label: string;
    /** Tipo */
    type: 'text' | 'number' | 'date' | 'datetime' | 'select' | 'multiselect' | 'textarea' | 'checkbox' | 'money' | 'file' | 'color' | 'cpf' | 'cnpj' | 'phone' | 'email' | 'cep' | 'rating';
    /** É obrigatório? */
    required: boolean;
    /** Placeholder */
    placeholder?: string;
    /** Opções (para select/multiselect) */
    options?: {
        label: string;
        value: string;
    }[];
    /** Valor padrão */
    defaultValue?: unknown;
    /** Ordem */
    order: number;
    /** Tamanho da coluna (1-12) */
    colSpan?: number;
}
export interface DetailTab {
    /** Nome da aba */
    label: string;
    /** Ícone */
    icon: string;
    /** Campos a exibir */
    fields: string[];
}
export interface Workflow {
    /** ID do fluxo */
    id: string;
    /** Nome */
    name: string;
    /** Descrição */
    description: string;
    /** Passos do fluxo */
    steps: WorkflowStep[];
    /** Gatilho (evento que inicia) */
    trigger: string;
}
export interface WorkflowStep {
    /** Ordem */
    order: number;
    /** Título */
    title: string;
    /** Descrição */
    description: string;
    /** Ação automática */
    autoAction?: string;
    /** Aprovações necessárias */
    approvals?: string[];
    /** Notificações */
    notifications?: {
        type: 'email' | 'push' | 'desktop';
        template: string;
    }[];
}
export interface CustomReport {
    /** ID */
    id: string;
    /** Nome */
    name: string;
    /** Descrição */
    description: string;
    /** Tipo */
    type: 'table' | 'chart' | 'summary' | 'export';
    /** Query ou endpoint */
    endpoint: string;
    /** Parâmetros */
    parameters?: ReportParameter[];
    /** Colunas */
    columns?: ReportColumn[];
    /** Gráfico (se for chart) */
    chartConfig?: {
        type: 'bar' | 'line' | 'pie' | 'area' | 'scatter';
        xField: string;
        yFields: string[];
        stacked: boolean;
    };
}
export interface ReportParameter {
    /** Nome */
    name: string;
    /** Rótulo */
    label: string;
    /** Tipo */
    type: 'date' | 'daterange' | 'select' | 'number' | 'text' | 'boolean';
    /** Obrigatório */
    required: boolean;
    /** Valor padrão */
    defaultValue?: unknown;
    /** Opções (select) */
    options?: {
        label: string;
        value: string;
    }[];
}
export interface ReportColumn {
    /** Campo */
    field: string;
    /** Rótulo */
    label: string;
    /** Tipo */
    type: 'text' | 'number' | 'money' | 'date' | 'boolean' | 'badge';
    /** Alinhamento */
    align?: 'left' | 'center' | 'right';
    /** Largura */
    width?: number;
    /** Ordenável */
    sortable?: boolean;
    /** Formatador */
    formatter?: string;
}
/**
 * Registry completo de todos os segmentos.
 * Usado para carregamento dinâmico de configurações.
 */
export type BusinessTypeRegistry = Record<BusinessType, BusinessTypeConfig>;
//# sourceMappingURL=business-types.d.ts.map