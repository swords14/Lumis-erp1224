/**
 * Formata um valor em centavos para moeda (ex: 1500 → "R$ 15,00")
 */
export declare function formatCurrency(cents: number, currency?: 'BRL' | 'USD' | 'EUR'): string;
/**
 * Converte valor monetário para centavos (ex: "15,00" → 1500)
 */
export declare function toCents(value: number): number;
/**
 * Converte centavos para valor decimal (ex: 1500 → 15.00)
 */
export declare function fromCents(cents: number): number;
/**
 * Formata CPF (ex: 12345678901 → "123.456.789-01")
 */
export declare function formatCPF(value: string): string;
/**
 * Formata CNPJ (ex: 12345678000199 → "12.345.678/0001-99")
 */
export declare function formatCNPJ(value: string): string;
/**
 * Formata telefone Brasil (ex: 11999999999 → "(11) 99999-9999")
 */
export declare function formatPhone(value: string): string;
/**
 * Formata CEP (ex: 12345678 → "12345-678")
 */
export declare function formatCEP(value: string): string;
/**
 * Remove caracteres não numéricos
 */
export declare function onlyNumbers(value: string): string;
/**
 * Gera um UUID v4
 */
export declare function generateUUID(): string;
/**
 * Trunca texto com reticências
 */
export declare function truncate(text: string, maxLength: number): string;
/**
 * Capitaliza primeira letra
 */
export declare function capitalize(text: string): string;
/**
 * Formata nome próprio (ex: "joão silva" → "João Silva")
 */
export declare function formatName(name: string): string;
/**
 * Formata número com separador de milhar
 */
export declare function formatNumber(value: number, decimals?: number): string;
/**
 * Formata porcentagem
 */
export declare function formatPercent(value: number, decimals?: number): string;
/**
 * Formata data para exibição
 */
export declare function formatDate(date: string | Date, format?: 'short' | 'long' | 'relative'): string;
/**
 * Formata data e hora
 */
export declare function formatDateTime(date: string | Date): string;
/**
 * Gera cor a partir de string (consistente)
 */
export declare function stringToColor(str: string): string;
/**
 * Iniciais de um nome (para avatares)
 */
export declare function getInitials(name: string): string;
/**
 * Delay assíncrono
 */
export declare function delay(ms: number): Promise<void>;
/**
 * Debounce
 */
export declare function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): (...args: Parameters<T>) => void;
/**
 * Throttle
 */
export declare function throttle<T extends (...args: unknown[]) => void>(fn: T, ms: number): (...args: Parameters<T>) => void;
/**
 * Clona objeto profundamente
 */
export declare function deepClone<T>(obj: T): T;
/**
 * Agrupa array por chave
 */
export declare function groupBy<T>(array: T[], key: keyof T): Record<string, T[]>;
/**
 * Ordena array por chave
 */
export declare function sortBy<T>(array: T[], key: keyof T, order?: 'asc' | 'desc'): T[];
/**
 * Remove itens duplicados de array
 */
export declare function unique<T>(array: T[]): T[];
/**
 * Pagina um array (client-side)
 */
export declare function paginate<T>(array: T[], page: number, limit: number): {
    data: T[];
    total: number;
    totalPages: number;
};
/**
 * Valida CPF
 */
export declare function validateCPF(cpf: string): boolean;
/**
 * Valida CNPJ
 */
export declare function validateCNPJ(cnpj: string): boolean;
//# sourceMappingURL=index.d.ts.map