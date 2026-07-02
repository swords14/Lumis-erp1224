/** Tipos de negócio suportados pelo ERP */
export declare enum BusinessType {
    LOJA = "loja",
    CLINICA = "clinica",
    DISTRIBUIDORA = "distribuidora",
    PRESTADORA_SERVICO = "prestadora_servico",
    BUFFET = "buffet",
    AUTOPECAS = "autopecas",
    RESTAURANTE = "restaurante",
    OFICINA = "oficina",
    ESCRITORIO = "escritorio",
    HOTEL = "hotel",
    IMOBILIARIA = "imobiliaria",
    ACADEMIA = "academia",
    PET_SHOP = "pet_shop",
    MERCADO = "mercado",
    FARMACIA = "farmacia",
    CONSTRUTORA = "construtora",
    TRANSPORTADORA = "transportadora"
}
/** Status de uma entidade no sistema */
export declare enum EntityStatus {
    ATIVO = "ativo",
    INATIVO = "inativo",
    PENDENTE = "pendente",
    BLOQUEADO = "bloqueado",
    EXCLUIDO = "excluido"
}
/** Tipos de pessoa para cadastros */
export declare enum PersonType {
    FISICA = "fisica",
    JURIDICA = "juridica"
}
/** Gênero */
export declare enum Gender {
    MASCULINO = "masculino",
    FEMININO = "feminino",
    OUTRO = "outro",
    NAO_INFORMADO = "nao_informado"
}
/** Tipos de endereço */
export declare enum AddressType {
    COMERCIAL = "comercial",
    RESIDENCIAL = "residencial",
    ENTREGA = "entrega",
    COBRANCA = "cobranca",
    OUTRO = "outro"
}
/** Tipos de contato */
export declare enum ContactType {
    TELEFONE = "telefone",
    CELULAR = "celular",
    EMAIL = "email",
    WHATSAPP = "whatsapp",
    SITE = "site",
    REDE_SOCIAL = "rede_social"
}
/** Unidades de medida para produtos */
export declare enum UnitOfMeasure {
    UNIDADE = "un",
    QUILOGRAMA = "kg",
    GRAMA = "g",
    LITRO = "l",
    MILILITRO = "ml",
    METRO = "m",
    CENTIMETRO = "cm",
    METRO_QUADRADO = "m2",
    METRO_CUBICO = "m3",
    CAIXA = "cx",
    PACOTE = "pct",
    DUZIA = "dz",
    PAR = "par",
    HORA = "h",
    DIA = "dia",
    SERVICO = "sv"
}
/** Tipos de movimentação de estoque */
export declare enum StockMovementType {
    ENTRADA = "entrada",
    SAIDA = "saida",
    TRANSFERENCIA = "transferencia",
    AJUSTE = "ajuste",
    DEVOLUCAO = "devolucao"
}
/** Status de uma venda/pedido */
export declare enum SaleStatus {
    ORCAMENTO = "orcamento",
    PENDENTE = "pendente",
    APROVADO = "aprovado",
    EM_PRODUCAO = "em_producao",
    ENVIADO = "enviado",
    ENTREGUE = "entregue",
    CANCELADO = "cancelado",
    DEVOLVIDO = "devolvido"
}
/** Formas de pagamento */
export declare enum PaymentMethod {
    DINHEIRO = "dinheiro",
    CARTAO_CREDITO = "cartao_credito",
    CARTAO_DEBITO = "cartao_debito",
    PIX = "pix",
    BOLETO = "boleto",
    TRANSFERENCIA = "transferencia",
    CHEQUE = "cheque",
    CREDIARIO = "crediario",
    VALE = "vale"
}
/** Status de pagamento */
export declare enum PaymentStatus {
    PENDENTE = "pendente",
    PAGO = "pago",
    PARCIAL = "parcial",
    ATRASADO = "atrasado",
    CANCELADO = "cancelado",
    ESTORNADO = "estornado"
}
/** Tipos de conta financeira */
export declare enum AccountType {
    CONTA_CORRENTE = "conta_corrente",
    CONTA_POUPANCA = "conta_poupanca",
    CAIXA = "caixa",
    INVESTIMENTO = "investimento",
    CARTAO_CREDITO = "cartao_credito",
    OUTRO = "outro"
}
/** Categorias de transações financeiras */
export declare enum TransactionCategory {
    RECEITA = "receita",
    DESPESA = "despesa",
    INVESTIMENTO = "investimento",
    TRANSFERENCIA = "transferencia",
    AJUSTE = "ajuste"
}
/** Subcategorias padrão */
export declare enum TransactionSubcategory {
    VENDAS = "vendas",
    SERVICOS = "servicos",
    COMISSOES = "comissoes",
    RENDIMENTOS = "rendimentos",
    REEMBOLSOS = "reembolsos",
    OUTRAS_RECEITAS = "outras_receitas",
    ALUGUEL = "aluguel",
    SALARIOS = "salarios",
    ENCARGOS = "encargos",
    IMPOSTOS = "impostos",
    FORNECEDORES = "fornecedores",
    MARKETING = "marketing",
    TI = "ti",
    ESCRITORIO = "escritorio",
    TRANSPORTE = "transporte",
    UTILIDADES = "utilidades",
    MANUTENCAO = "manutencao",
    TAXAS = "taxas",
    OUTRAS_DESPESAS = "outras_despesas"
}
/** Perfis de usuário padrão */
export declare enum SystemRole {
    ADMIN = "admin",
    GERENTE = "gerente",
    SUPERVISOR = "supervisor",
    OPERADOR = "operador",
    FINANCEIRO = "financeiro",
    VENDEDOR = "vendedor",
    ESTOQUISTA = "estoquista",
    CAIXA = "caixa",
    LEITURA = "leitura"
}
/** Ações de permissão */
export declare enum PermissionAction {
    CRIAR = "criar",
    LER = "ler",
    ATUALIZAR = "atualizar",
    EXCLUIR = "excluir",
    EXPORTAR = "exportar",
    IMPORTAR = "importar",
    APROVAR = "aprovar",
    CANCELAR = "cancelar"
}
/** Módulos do sistema */
export declare enum SystemModule {
    DASHBOARD = "dashboard",
    CADASTROS = "cadastros",
    CLIENTES = "clientes",
    FORNECEDORES = "fornecedores",
    PRODUTOS = "produtos",
    FINANCEIRO = "financeiro",
    CONTAS_PAGAR = "contas_pagar",
    CONTAS_RECEBER = "contas_receber",
    FLUXO_CAIXA = "fluxo_caixa",
    ESTOQUE = "estoque",
    VENDAS = "vendas",
    PDV = "pdv",
    ORCAMENTOS = "orcamentos",
    COMPRAS = "compras",
    RELATORIOS = "relatorios",
    CONFIGURACOES = "configuracoes",
    USUARIOS = "usuarios",
    PERMISSOES = "permissoes",
    EMPRESAS = "empresas",
    AUDITORIA = "auditoria",
    BACKUP = "backup",
    MESAS = "mesas",// Restaurante
    COMANDA = "comanda",// Restaurante
    COZINHA = "cozinha",// Restaurante
    ENTREGA = "entrega",// Restaurante
    PACIENTES = "pacientes",// Clínica
    PRONTUARIOS = "prontuarios",// Clínica
    CONSULTAS = "consultas",// Clínica
    AGENDA = "agenda",// Clínica
    CONVENIOS = "convenios",// Clínica
    QUARTOS = "quartos",// Hotel
    RESERVAS = "reservas",// Hotel
    HOSPEDAGEM = "hospedagem",// Hotel
    IMOVEIS = "imoveis",// Imobiliária
    CONTRATOS = "contratos",// Imobiliária
    ALUNOS = "alunos",// Academia
    TREINOS = "treinos",// Academia
    MATRICULAS = "matriculas"
}
/** Níveis de experiência do usuário */
export declare enum UserExperienceLevel {
    INICIANTE = "iniciante",
    INTERMEDIARIO = "intermediario",
    AVANCADO = "avancado",
    ESPECIALISTA = "especialista"
}
/** Tipos de tour guiado */
export declare enum TourType {
    PRIMEIRO_ACESSO = "primeiro_acesso",
    MODULO = "modulo",
    FUNCIONALIDADE = "funcionalidade",
    ATALHO = "atalho"
}
/** Frequência de backup */
export declare enum BackupFrequency {
    DIARIO = "diario",
    SEMANAL = "semanal",
    MENSAL = "mensal",
    MANUAL = "manual"
}
/** Tipos de log de auditoria */
export declare enum AuditAction {
    LOGIN = "login",
    LOGOUT = "logout",
    CRIAR = "criar",
    ATUALIZAR = "atualizar",
    EXCLUIR = "excluir",
    EXPORTAR = "exportar",
    IMPORTAR = "importar",
    ALTERAR_SENHA = "alterar_senha",
    ALTERAR_PERMISSOES = "alterar_permissoes",
    BACKUP = "backup",
    RESTORE = "restore"
}
/** Regime tributário (apenas informativo, sem cálculos fiscais) */
export declare enum TaxRegime {
    SIMPLES_NACIONAL = "simples_nacional",
    LUCRO_PRESUMIDO = "lucro_presumido",
    LUCRO_REAL = "lucro_real",
    MEI = "mei",
    ISENTO = "isento"
}
/** Estados brasileiros */
export declare enum BrazilianState {
    AC = "AC",
    AL = "AL",
    AP = "AP",
    AM = "AM",
    BA = "BA",
    CE = "CE",
    DF = "DF",
    ES = "ES",
    GO = "GO",
    MA = "MA",
    MT = "MT",
    MS = "MS",
    MG = "MG",
    PA = "PA",
    PB = "PB",
    PR = "PR",
    PE = "PE",
    PI = "PI",
    RJ = "RJ",
    RN = "RN",
    RS = "RS",
    RO = "RO",
    RR = "RR",
    SC = "SC",
    SP = "SP",
    SE = "SE",
    TO = "TO"
}
//# sourceMappingURL=index.d.ts.map