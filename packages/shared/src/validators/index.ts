// ──── Validadores Zod Compartilhados ────

import { z } from 'zod';

/** Validador de email */
export const emailSchema = z
  .string()
  .email('Email inválido')
  .min(5, 'Email muito curto')
  .max(255, 'Email muito longo')
  .toLowerCase()
  .trim();

/** Validador de senha forte */
export const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter no mínimo 8 caracteres')
  .max(128, 'Senha muito longa')
  .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
  .regex(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    'Senha deve conter pelo menos um caractere especial',
  );

/** Validador de CPF */
export const cpfSchema = z
  .string()
  .transform((val) => val.replace(/\D/g, ''))
  .refine((val) => val.length === 11, 'CPF deve ter 11 dígitos')
  .refine((val) => !/^(\d)\1{10}$/.test(val), 'CPF inválido');

/** Validador de CNPJ */
export const cnpjSchema = z
  .string()
  .transform((val) => val.replace(/\D/g, ''))
  .refine((val) => val.length === 14, 'CNPJ deve ter 14 dígitos')
  .refine((val) => !/^(\d)\1{13}$/.test(val), 'CNPJ inválido');

/** Validador de telefone Brasil */
export const phoneSchema = z
  .string()
  .transform((val) => val.replace(/\D/g, ''))
  .refine(
    (val) => val.length === 10 || val.length === 11,
    'Telefone deve ter 10 ou 11 dígitos (com DDD)',
  );

/** Validador de CEP */
export const cepSchema = z
  .string()
  .transform((val) => val.replace(/\D/g, ''))
  .refine((val) => val.length === 8, 'CEP deve ter 8 dígitos');

/** Validador de nome */
export const nameSchema = z
  .string()
  .min(2, 'Nome deve ter no mínimo 2 caracteres')
  .max(200, 'Nome muito longo')
  .trim();

/** Validador de valor monetário (em centavos) */
export const moneySchema = z
  .number()
  .int('Valor deve ser em centavos (inteiro)')
  .min(0, 'Valor não pode ser negativo');

/** Validador de quantidade */
export const quantitySchema = z
  .number()
  .min(0, 'Quantidade não pode ser negativa')
  .max(999999999, 'Quantidade muito grande');

/** Validador de porcentagem */
export const percentSchema = z
  .number()
  .min(0, 'Porcentagem não pode ser negativa')
  .max(100, 'Porcentagem não pode ser maior que 100');

/** Validador de UUID */
export const uuidSchema = z
  .string()
  .uuid('ID inválido');

/** Validador de data ISO */
export const dateSchema = z
  .string()
  .datetime({ message: 'Data inválida' });

/** Schema de endereço */
export const addressSchema = z.object({
  type: z.enum(['comercial', 'residencial', 'entrega', 'cobranca', 'outro']),
  cep: z.string().min(8, 'CEP obrigatório'),
  street: z.string().min(2, 'Rua obrigatória'),
  number: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres (UF)'),
  country: z.string().default('Brasil'),
  isDefault: z.boolean().default(false),
});

/** Schema de contato */
export const contactSchema = z.object({
  type: z.enum([
    'telefone',
    'celular',
    'email',
    'whatsapp',
    'site',
    'rede_social',
  ]),
  value: z.string().min(1, 'Valor obrigatório'),
  label: z.string().optional(),
  isDefault: z.boolean().default(false),
});

/** Schema de login */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha obrigatória'),
  tenantId: uuidSchema.optional(),
});

/** Schema de criação de usuário */
export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: z.string().min(1, 'Perfil obrigatório'),
  tenantId: uuidSchema,
  avatar: z.string().url().optional(),
});

/** Schema de atualização de usuário */
export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  role: z.string().optional(),
  avatar: z.string().url().optional().nullable(),
  status: z.enum(['ativo', 'inativo', 'bloqueado']).optional(),
});

/** Schema de troca de senha */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual obrigatória'),
  newPassword: passwordSchema,
});

/** Schema de criação de empresa */
export const createTenantSchema = z.object({
  name: z.string().min(2, 'Nome da empresa obrigatório'),
  fantasyName: z.string().optional(),
  document: cnpjSchema.optional(),
  businessType: z.string().min(1, 'Tipo de negócio obrigatório'),
  taxRegime: z.string().optional(),
  address: addressSchema.optional(),
  contacts: z.array(contactSchema).optional(),
});

/** Schema de criação de produto */
export const createProductSchema = z.object({
  code: z.string().min(1, 'Código obrigatório'),
  barcode: z.string().optional(),
  name: z.string().min(2, 'Nome obrigatório'),
  description: z.string().optional(),
  unitOfMeasure: z.string().min(1, 'Unidade de medida obrigatória'),
  categoryId: uuidSchema.optional(),
  brand: z.string().optional(),
  costPrice: moneySchema,
  sellingPrice: moneySchema,
  minStock: quantitySchema.default(0),
  maxStock: quantitySchema.default(999),
  isService: z.boolean().default(false),
  isActive: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
});

/** Schema de criação de pessoa (cliente/fornecedor) */
export const createPersonSchema = z.object({
  type: z.enum(['fisica', 'juridica']),
  name: nameSchema,
  fantasyName: z.string().optional(),
  documents: z
    .array(
      z.object({
        type: z.enum(['cpf', 'cnpj', 'rg', 'ie', 'im', 'outro']),
        value: z.string().min(1, 'Documento obrigatório'),
      }),
    )
    .optional(),
  contacts: z.array(contactSchema).optional(),
  addresses: z.array(addressSchema).optional(),
  birthDate: dateSchema.optional(),
  gender: z
    .enum(['masculino', 'feminino', 'outro', 'nao_informado'])
    .optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isSupplier: z.boolean().default(false),
  isCustomer: z.boolean().default(true),
});

/** Schema de criação de venda */
export const createSaleSchema = z.object({
  customerId: uuidSchema.optional(),
  items: z
    .array(
      z.object({
        productId: uuidSchema,
        quantity: quantitySchema.refine((n) => n > 0, 'Quantidade deve ser maior que zero'),
        unitPrice: moneySchema,
        discount: moneySchema.default(0),
      }),
    )
    .min(1, 'Pedido deve ter pelo menos um item'),
  discount: moneySchema.default(0),
  additions: moneySchema.default(0),
  payments: z
    .array(
      z.object({
        method: z.string().min(1, 'Forma de pagamento obrigatória'),
        amount: moneySchema,
        installments: z.number().int().min(1).max(36).optional(),
      }),
    )
    .optional(),
  notes: z.string().optional(),
});

/** Schema de criação de transação financeira */
export const createTransactionSchema = z.object({
  accountId: uuidSchema,
  category: z.string().min(1, 'Categoria obrigatória'),
  subcategory: z.string().optional(),
  description: z.string().min(2, 'Descrição obrigatória'),
  amount: moneySchema,
  dueDate: dateSchema,
  personId: uuidSchema.optional(),
  saleId: uuidSchema.optional(),
  recurrence: z
    .object({
      frequency: z.enum(['diario', 'semanal', 'mensal', 'anual']),
      interval: z.number().int().min(1),
      endDate: dateSchema.optional(),
      occurrences: z.number().int().min(1).optional(),
    })
    .optional(),
  notes: z.string().optional(),
});

/** Schema de paginação */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
});

/** Schema de configuração de backup */
export const backupConfigSchema = z.object({
  frequency: z.enum(['diario', 'semanal', 'mensal', 'manual']),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida (HH:mm)'),
  day: z.number().int().min(1).max(31).optional(),
  retention: z.number().int().min(1).max(365).default(30),
  includeFiles: z.boolean().default(false),
  destination: z.string().optional(),
});

/** Função genérica para validar e retornar dados tipados */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/** Função genérica para validar e retornar dados seguros (safeParse) */
export function validateSafe<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/** Extrai mensagens de erro de um ZodError */
export function extractZodErrors(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.') || 'root';
    if (!errors[path]) errors[path] = [];
    errors[path].push(issue.message);
  }
  return errors;
}