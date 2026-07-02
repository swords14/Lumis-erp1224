import { z } from 'zod';
/** Validador de email */
export declare const emailSchema: z.ZodString;
/** Validador de senha forte */
export declare const passwordSchema: z.ZodString;
/** Validador de CPF */
export declare const cpfSchema: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>;
/** Validador de CNPJ */
export declare const cnpjSchema: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>;
/** Validador de telefone Brasil */
export declare const phoneSchema: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
/** Validador de CEP */
export declare const cepSchema: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
/** Validador de nome */
export declare const nameSchema: z.ZodString;
/** Validador de valor monetário (em centavos) */
export declare const moneySchema: z.ZodNumber;
/** Validador de quantidade */
export declare const quantitySchema: z.ZodNumber;
/** Validador de porcentagem */
export declare const percentSchema: z.ZodNumber;
/** Validador de UUID */
export declare const uuidSchema: z.ZodString;
/** Validador de data ISO */
export declare const dateSchema: z.ZodString;
/** Schema de endereço */
export declare const addressSchema: z.ZodObject<{
    type: z.ZodEnum<["comercial", "residencial", "entrega", "cobranca", "outro"]>;
    cep: z.ZodString;
    street: z.ZodString;
    number: z.ZodString;
    complement: z.ZodOptional<z.ZodString>;
    neighborhood: z.ZodString;
    city: z.ZodString;
    state: z.ZodString;
    country: z.ZodDefault<z.ZodString>;
    isDefault: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    number: string;
    type: "outro" | "comercial" | "residencial" | "entrega" | "cobranca";
    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    isDefault: boolean;
    complement?: string | undefined;
}, {
    number: string;
    type: "outro" | "comercial" | "residencial" | "entrega" | "cobranca";
    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    complement?: string | undefined;
    country?: string | undefined;
    isDefault?: boolean | undefined;
}>;
/** Schema de contato */
export declare const contactSchema: z.ZodObject<{
    type: z.ZodEnum<["telefone", "celular", "email", "whatsapp", "site", "rede_social"]>;
    value: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    isDefault: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "telefone" | "celular" | "email" | "whatsapp" | "site" | "rede_social";
    value: string;
    isDefault: boolean;
    label?: string | undefined;
}, {
    type: "telefone" | "celular" | "email" | "whatsapp" | "site" | "rede_social";
    value: string;
    label?: string | undefined;
    isDefault?: boolean | undefined;
}>;
/** Schema de login */
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    tenantId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    tenantId?: string | undefined;
}, {
    email: string;
    password: string;
    tenantId?: string | undefined;
}>;
/** Schema de criação de usuário */
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodString;
    tenantId: z.ZodString;
    avatar: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    tenantId: string;
    password: string;
    name: string;
    role: string;
    avatar?: string | undefined;
}, {
    email: string;
    tenantId: string;
    password: string;
    name: string;
    role: string;
    avatar?: string | undefined;
}>;
/** Schema de atualização de usuário */
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodString>;
    avatar: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<["ativo", "inativo", "bloqueado"]>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    status?: "ativo" | "inativo" | "bloqueado" | undefined;
    name?: string | undefined;
    role?: string | undefined;
    avatar?: string | null | undefined;
}, {
    email?: string | undefined;
    status?: "ativo" | "inativo" | "bloqueado" | undefined;
    name?: string | undefined;
    role?: string | undefined;
    avatar?: string | null | undefined;
}>;
/** Schema de troca de senha */
export declare const changePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
/** Schema de criação de empresa */
export declare const createTenantSchema: z.ZodObject<{
    name: z.ZodString;
    fantasyName: z.ZodOptional<z.ZodString>;
    document: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>>;
    businessType: z.ZodString;
    taxRegime: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<["comercial", "residencial", "entrega", "cobranca", "outro"]>;
        cep: z.ZodString;
        street: z.ZodString;
        number: z.ZodString;
        complement: z.ZodOptional<z.ZodString>;
        neighborhood: z.ZodString;
        city: z.ZodString;
        state: z.ZodString;
        country: z.ZodDefault<z.ZodString>;
        isDefault: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        number: string;
        type: "outro" | "comercial" | "residencial" | "entrega" | "cobranca";
        cep: string;
        street: string;
        neighborhood: string;
        city: string;
        state: string;
        country: string;
        isDefault: boolean;
        complement?: string | undefined;
    }, {
        number: string;
        type: "outro" | "comercial" | "residencial" | "entrega" | "cobranca";
        cep: string;
        street: string;
        neighborhood: string;
        city: string;
        state: string;
        complement?: string | undefined;
        country?: string | undefined;
        isDefault?: boolean | undefined;
    }>>;
    contacts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["telefone", "celular", "email", "whatsapp", "site", "rede_social"]>;
        value: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        isDefault: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: "telefone" | "celular" | "email" | "whatsapp" | "site" | "rede_social";
        value: string;
        isDefault: boolean;
        label?: string | undefined;
    }, {
        type: "telefone" | "celular" | "email" | "whatsapp" | "site" | "rede_social";
        value: string;
        label?: string | undefined;
        isDefault?: boolean | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    businessType: string;
    document?: string | undefined;
    fantasyName?: string | undefined;
    taxRegime?: string | undefined;
    address?: {
        number: string;
        type: "outro" | "comercial" | "residencial" | "entrega" | "cobranca";
        cep: string;
        street: string;
        neighborhood: string;
        city: string;
        state: string;
        country: string;
        isDefault: boolean;
        complement?: string | undefined;
    } | undefined;
    contacts?: {
        type: "telefone" | "celular" | "email" | "whatsapp" | "site" | "rede_social";
        value: string;
        isDefault: boolean;
        label?: string | undefined;
    }[] | undefined;
}, {
    name: string;
    businessType: string;
    document?: string | undefined;
    fantasyName?: string | undefined;
    taxRegime?: string | undefined;
    address?: {
        number: string;
        type: "outro" | "comercial" | "residencial" | "entrega" | "cobranca";
        cep: string;
        street: string;
        neighborhood: string;
        city: string;
        state: string;
        complement?: string | undefined;
        country?: string | undefined;
        isDefault?: boolean | undefined;
    } | undefined;
    contacts?: {
        type: "telefone" | "celular" | "email" | "whatsapp" | "site" | "rede_social";
        value: string;
        label?: string | undefined;
        isDefault?: boolean | undefined;
    }[] | undefined;
}>;
/** Schema de criação de produto */
export declare const createProductSchema: z.ZodObject<{
    code: z.ZodString;
    barcode: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    unitOfMeasure: z.ZodString;
    categoryId: z.ZodOptional<z.ZodString>;
    brand: z.ZodOptional<z.ZodString>;
    costPrice: z.ZodNumber;
    sellingPrice: z.ZodNumber;
    minStock: z.ZodDefault<z.ZodNumber>;
    maxStock: z.ZodDefault<z.ZodNumber>;
    isService: z.ZodDefault<z.ZodBoolean>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    isService: boolean;
    isActive: boolean;
    code: string;
    name: string;
    unitOfMeasure: string;
    costPrice: number;
    sellingPrice: number;
    minStock: number;
    maxStock: number;
    tags?: string[] | undefined;
    categoryId?: string | undefined;
    barcode?: string | undefined;
    description?: string | undefined;
    brand?: string | undefined;
}, {
    code: string;
    name: string;
    unitOfMeasure: string;
    costPrice: number;
    sellingPrice: number;
    tags?: string[] | undefined;
    categoryId?: string | undefined;
    isService?: boolean | undefined;
    isActive?: boolean | undefined;
    barcode?: string | undefined;
    description?: string | undefined;
    brand?: string | undefined;
    minStock?: number | undefined;
    maxStock?: number | undefined;
}>;
/** Schema de criação de pessoa (cliente/fornecedor) */
export declare const createPersonSchema: z.ZodObject<{
    type: z.ZodEnum<["fisica", "juridica"]>;
    name: z.ZodString;
    fantasyName: z.ZodOptional<z.ZodString>;
    documents: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["cpf", "cnpj", "rg", "ie", "im", "outro"]>;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "outro" | "cpf" | "cnpj" | "rg" | "ie" | "im";
        value: string;
    }, {
        type: "outro" | "cpf" | "cnpj" | "rg" | "ie" | "im";
        value: string;
    }>, "many">>;
    contacts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["telefone", "celular", "email", "whatsapp", "site", "rede_social"]>;
        value: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        isDefault: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: "telefone" | "celular" | "email" | "whatsapp" | "site" | "rede_social";
        value: string;
        isDefault: boolean;
        label?: string | undefined;
    }, {
        type: "telefone" | "celular" | "email" | "whatsapp" | "site" | "rede_social";
        value: string;
        label?: string | undefined;
        isDefault?: boolean | undefined;
    }>, "many">>;
    addresses: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["comercial", "residencial", "entrega", "cobranca", "outro"]>;
        cep: z.ZodString;
        street: z.ZodString;
        number: z.ZodString;
        complement: z.ZodOptional<z.ZodString>;
        neighborhood: z.ZodString;
        city: z.ZodString;
        state: z.ZodString;
        country: z.ZodDefault<z.ZodString>;
        isDefault: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        number: string;
        type: "outro" | "comercial" | "residencial" | "entrega" | "cobranca";
        cep: string;
        street: string;
        neighborhood: string;
        city: string;
        state: string;
        country: string;
        isDefault: boolean;
        complement?: string | undefined;
    }, {
        number: string;
        type: "outro" | "comercial" | "residencial" | "entrega" | "cobranca";
        cep: string;
        street: string;
        neighborhood: string;
        city: string;
        state: string;
        complement?: string | undefined;
        country?: string | undefined;
        isDefault?: boolean | undefined;
    }>, "many">>;
    birthDate: z.ZodOptional<z.ZodString>;
    gender: z.ZodOptional<z.ZodEnum<["masculino", "feminino", "outro", "nao_informado"]>>;
    notes: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    isSupplier: z.ZodDefault<z.ZodBoolean>;
    isCustomer: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "fisica" | "juridica";
    isCustomer: boolean;
    isSupplier: boolean;
    name: string;
    tags?: string[] | undefined;
    fantasyName?: string | undefined;
    contacts?: {
        type: "telefone" | "celular" | "email" | "whatsapp" | "site" | "rede_social";
        value: string;
        isDefault: boolean;
        label?: string | undefined;
    }[] | undefined;
    documents?: {
        type: "outro" | "cpf" | "cnpj" | "rg" | "ie" | "im";
        value: string;
    }[] | undefined;
    addresses?: {
        number: string;
        type: "outro" | "comercial" | "residencial" | "entrega" | "cobranca";
        cep: string;
        street: string;
        neighborhood: string;
        city: string;
        state: string;
        country: string;
        isDefault: boolean;
        complement?: string | undefined;
    }[] | undefined;
    birthDate?: string | undefined;
    gender?: "masculino" | "feminino" | "outro" | "nao_informado" | undefined;
    notes?: string | undefined;
}, {
    type: "fisica" | "juridica";
    name: string;
    tags?: string[] | undefined;
    isCustomer?: boolean | undefined;
    isSupplier?: boolean | undefined;
    fantasyName?: string | undefined;
    contacts?: {
        type: "telefone" | "celular" | "email" | "whatsapp" | "site" | "rede_social";
        value: string;
        label?: string | undefined;
        isDefault?: boolean | undefined;
    }[] | undefined;
    documents?: {
        type: "outro" | "cpf" | "cnpj" | "rg" | "ie" | "im";
        value: string;
    }[] | undefined;
    addresses?: {
        number: string;
        type: "outro" | "comercial" | "residencial" | "entrega" | "cobranca";
        cep: string;
        street: string;
        neighborhood: string;
        city: string;
        state: string;
        complement?: string | undefined;
        country?: string | undefined;
        isDefault?: boolean | undefined;
    }[] | undefined;
    birthDate?: string | undefined;
    gender?: "masculino" | "feminino" | "outro" | "nao_informado" | undefined;
    notes?: string | undefined;
}>;
/** Schema de criação de venda */
export declare const createSaleSchema: z.ZodObject<{
    customerId: z.ZodOptional<z.ZodString>;
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        quantity: z.ZodEffects<z.ZodNumber, number, number>;
        unitPrice: z.ZodNumber;
        discount: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        productId: string;
        quantity: number;
        unitPrice: number;
        discount: number;
    }, {
        productId: string;
        quantity: number;
        unitPrice: number;
        discount?: number | undefined;
    }>, "many">;
    discount: z.ZodDefault<z.ZodNumber>;
    additions: z.ZodDefault<z.ZodNumber>;
    payments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        method: z.ZodString;
        amount: z.ZodNumber;
        installments: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        method: string;
        amount: number;
        installments?: number | undefined;
    }, {
        method: string;
        amount: number;
        installments?: number | undefined;
    }>, "many">>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    discount: number;
    items: {
        productId: string;
        quantity: number;
        unitPrice: number;
        discount: number;
    }[];
    additions: number;
    customerId?: string | undefined;
    notes?: string | undefined;
    payments?: {
        method: string;
        amount: number;
        installments?: number | undefined;
    }[] | undefined;
}, {
    items: {
        productId: string;
        quantity: number;
        unitPrice: number;
        discount?: number | undefined;
    }[];
    customerId?: string | undefined;
    notes?: string | undefined;
    discount?: number | undefined;
    additions?: number | undefined;
    payments?: {
        method: string;
        amount: number;
        installments?: number | undefined;
    }[] | undefined;
}>;
/** Schema de criação de transação financeira */
export declare const createTransactionSchema: z.ZodObject<{
    accountId: z.ZodString;
    category: z.ZodString;
    subcategory: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    amount: z.ZodNumber;
    dueDate: z.ZodString;
    personId: z.ZodOptional<z.ZodString>;
    saleId: z.ZodOptional<z.ZodString>;
    recurrence: z.ZodOptional<z.ZodObject<{
        frequency: z.ZodEnum<["diario", "semanal", "mensal", "anual"]>;
        interval: z.ZodNumber;
        endDate: z.ZodOptional<z.ZodString>;
        occurrences: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        frequency: "diario" | "semanal" | "mensal" | "anual";
        interval: number;
        endDate?: string | undefined;
        occurrences?: number | undefined;
    }, {
        frequency: "diario" | "semanal" | "mensal" | "anual";
        interval: number;
        endDate?: string | undefined;
        occurrences?: number | undefined;
    }>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    accountId: string;
    category: string;
    description: string;
    amount: number;
    dueDate: string;
    subcategory?: string | undefined;
    personId?: string | undefined;
    notes?: string | undefined;
    saleId?: string | undefined;
    recurrence?: {
        frequency: "diario" | "semanal" | "mensal" | "anual";
        interval: number;
        endDate?: string | undefined;
        occurrences?: number | undefined;
    } | undefined;
}, {
    accountId: string;
    category: string;
    description: string;
    amount: number;
    dueDate: string;
    subcategory?: string | undefined;
    personId?: string | undefined;
    notes?: string | undefined;
    saleId?: string | undefined;
    recurrence?: {
        frequency: "diario" | "semanal" | "mensal" | "anual";
        interval: number;
        endDate?: string | undefined;
        occurrences?: number | undefined;
    } | undefined;
}>;
/** Schema de paginação */
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    sortBy?: string | undefined;
    search?: string | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    search?: string | undefined;
}>;
/** Schema de configuração de backup */
export declare const backupConfigSchema: z.ZodObject<{
    frequency: z.ZodEnum<["diario", "semanal", "mensal", "manual"]>;
    time: z.ZodString;
    day: z.ZodOptional<z.ZodNumber>;
    retention: z.ZodDefault<z.ZodNumber>;
    includeFiles: z.ZodDefault<z.ZodBoolean>;
    destination: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    frequency: "diario" | "semanal" | "mensal" | "manual";
    time: string;
    retention: number;
    includeFiles: boolean;
    day?: number | undefined;
    destination?: string | undefined;
}, {
    frequency: "diario" | "semanal" | "mensal" | "manual";
    time: string;
    day?: number | undefined;
    retention?: number | undefined;
    includeFiles?: boolean | undefined;
    destination?: string | undefined;
}>;
/** Função genérica para validar e retornar dados tipados */
export declare function validate<T>(schema: z.ZodSchema<T>, data: unknown): T;
/** Função genérica para validar e retornar dados seguros (safeParse) */
export declare function validateSafe<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: true;
    data: T;
} | {
    success: false;
    errors: z.ZodError;
};
/** Extrai mensagens de erro de um ZodError */
export declare function extractZodErrors(error: z.ZodError): Record<string, string[]>;
//# sourceMappingURL=index.d.ts.map