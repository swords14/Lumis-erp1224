// ──── Utilitários Compartilhados ────
/**
 * Formata um valor em centavos para moeda (ex: 1500 → "R$ 15,00")
 */
export function formatCurrency(cents, currency = 'BRL') {
    const config = {
        BRL: { locale: 'pt-BR', currency: 'BRL' },
        USD: { locale: 'en-US', currency: 'USD' },
        EUR: { locale: 'de-DE', currency: 'EUR' },
    };
    const { locale, currency: curr } = config[currency];
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: curr,
    }).format(cents / 100);
}
/**
 * Converte valor monetário para centavos (ex: "15,00" → 1500)
 */
export function toCents(value) {
    return Math.round(value * 100);
}
/**
 * Converte centavos para valor decimal (ex: 1500 → 15.00)
 */
export function fromCents(cents) {
    return cents / 100;
}
/**
 * Formata CPF (ex: 12345678901 → "123.456.789-01")
 */
export function formatCPF(value) {
    const nums = value.replace(/\D/g, '');
    return nums
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
/**
 * Formata CNPJ (ex: 12345678000199 → "12.345.678/0001-99")
 */
export function formatCNPJ(value) {
    const nums = value.replace(/\D/g, '');
    return nums
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
}
/**
 * Formata telefone Brasil (ex: 11999999999 → "(11) 99999-9999")
 */
export function formatPhone(value) {
    const nums = value.replace(/\D/g, '');
    if (nums.length === 11) {
        return nums.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (nums.length === 10) {
        return nums.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return value;
}
/**
 * Formata CEP (ex: 12345678 → "12345-678")
 */
export function formatCEP(value) {
    const nums = value.replace(/\D/g, '');
    return nums.replace(/(\d{5})(\d{3})/, '$1-$2');
}
/**
 * Remove caracteres não numéricos
 */
export function onlyNumbers(value) {
    return value.replace(/\D/g, '');
}
/**
 * Gera um UUID v4
 */
export function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // fallback
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
/**
 * Trunca texto com reticências
 */
export function truncate(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength).trimEnd() + '…';
}
/**
 * Capitaliza primeira letra
 */
export function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
/**
 * Formata nome próprio (ex: "joão silva" → "João Silva")
 */
export function formatName(name) {
    const prepositions = ['da', 'de', 'do', 'das', 'dos', 'e'];
    return name
        .toLowerCase()
        .split(' ')
        .map((word, index) => {
        if (index > 0 && prepositions.includes(word))
            return word;
        return capitalize(word);
    })
        .join(' ');
}
/**
 * Formata número com separador de milhar
 */
export function formatNumber(value, decimals = 0) {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}
/**
 * Formata porcentagem
 */
export function formatPercent(value, decimals = 1) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value / 100);
}
/**
 * Formata data para exibição
 */
export function formatDate(date, format = 'short') {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (format === 'relative') {
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (minutes < 1)
            return 'Agora mesmo';
        if (minutes < 60)
            return `Há ${minutes} min`;
        if (hours < 24)
            return `Há ${hours}h`;
        if (days < 7)
            return `Há ${days}d`;
    }
    if (format === 'long') {
        return d.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }
    return d.toLocaleDateString('pt-BR');
}
/**
 * Formata data e hora
 */
export function formatDateTime(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
/**
 * Gera cor a partir de string (consistente)
 */
export function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h}, 65%, 50%)`;
}
/**
 * Iniciais de um nome (para avatares)
 */
export function getInitials(name) {
    return name
        .split(' ')
        .map((word) => word.charAt(0))
        .filter((_, i, arr) => i === 0 || i === arr.length - 1)
        .join('')
        .toUpperCase()
        .substring(0, 2);
}
/**
 * Delay assíncrono
 */
export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Debounce
 */
export function debounce(fn, ms) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), ms);
    };
}
/**
 * Throttle
 */
export function throttle(fn, ms) {
    let lastTime = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastTime >= ms) {
            lastTime = now;
            fn(...args);
        }
    };
}
/**
 * Clona objeto profundamente
 */
export function deepClone(obj) {
    if (typeof structuredClone !== 'undefined') {
        return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj));
}
/**
 * Agrupa array por chave
 */
export function groupBy(array, key) {
    return array.reduce((groups, item) => {
        const groupKey = String(item[key]);
        if (!groups[groupKey])
            groups[groupKey] = [];
        groups[groupKey].push(item);
        return groups;
    }, {});
}
/**
 * Ordena array por chave
 */
export function sortBy(array, key, order = 'asc') {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return order === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return order === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return 0;
    });
}
/**
 * Remove itens duplicados de array
 */
export function unique(array) {
    return [...new Set(array)];
}
/**
 * Pagina um array (client-side)
 */
export function paginate(array, page, limit) {
    const total = array.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
        data: array.slice(start, end),
        total,
        totalPages,
    };
}
/**
 * Valida CPF
 */
export function validateCPF(cpf) {
    const nums = onlyNumbers(cpf);
    if (nums.length !== 11)
        return false;
    if (/^(\d)\1{10}$/.test(nums))
        return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(nums.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10)
        remainder = 0;
    if (remainder !== parseInt(nums.charAt(9)))
        return false;
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(nums.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10)
        remainder = 0;
    return remainder === parseInt(nums.charAt(10));
}
/**
 * Valida CNPJ
 */
export function validateCNPJ(cnpj) {
    const nums = onlyNumbers(cnpj);
    if (nums.length !== 14)
        return false;
    if (/^(\d)\1{13}$/.test(nums))
        return false;
    const calc = (x) => {
        const digitos = nums.substring(0, x);
        let sum = 0;
        let pos = x - 7;
        for (let i = x; i >= 1; i--) {
            sum += parseInt(digitos.charAt(x - i)) * pos--;
            if (pos < 2)
                pos = 9;
        }
        const result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        return result;
    };
    return calc(12) === parseInt(nums.charAt(12)) &&
        calc(13) === parseInt(nums.charAt(13));
}
//# sourceMappingURL=index.js.map