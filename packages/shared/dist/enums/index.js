// ──── Enums de Domínio do ERP ────
/** Tipos de negócio suportados pelo ERP */
export var BusinessType;
(function (BusinessType) {
    BusinessType["LOJA"] = "loja";
    BusinessType["CLINICA"] = "clinica";
    BusinessType["DISTRIBUIDORA"] = "distribuidora";
    BusinessType["PRESTADORA_SERVICO"] = "prestadora_servico";
    BusinessType["BUFFET"] = "buffet";
    BusinessType["AUTOPECAS"] = "autopecas";
    BusinessType["RESTAURANTE"] = "restaurante";
    BusinessType["OFICINA"] = "oficina";
    BusinessType["ESCRITORIO"] = "escritorio";
    BusinessType["HOTEL"] = "hotel";
    BusinessType["IMOBILIARIA"] = "imobiliaria";
    BusinessType["ACADEMIA"] = "academia";
    BusinessType["PET_SHOP"] = "pet_shop";
    BusinessType["MERCADO"] = "mercado";
    BusinessType["FARMACIA"] = "farmacia";
    BusinessType["CONSTRUTORA"] = "construtora";
    BusinessType["TRANSPORTADORA"] = "transportadora";
})(BusinessType || (BusinessType = {}));
/** Status de uma entidade no sistema */
export var EntityStatus;
(function (EntityStatus) {
    EntityStatus["ATIVO"] = "ativo";
    EntityStatus["INATIVO"] = "inativo";
    EntityStatus["PENDENTE"] = "pendente";
    EntityStatus["BLOQUEADO"] = "bloqueado";
    EntityStatus["EXCLUIDO"] = "excluido";
})(EntityStatus || (EntityStatus = {}));
/** Tipos de pessoa para cadastros */
export var PersonType;
(function (PersonType) {
    PersonType["FISICA"] = "fisica";
    PersonType["JURIDICA"] = "juridica";
})(PersonType || (PersonType = {}));
/** Gênero */
export var Gender;
(function (Gender) {
    Gender["MASCULINO"] = "masculino";
    Gender["FEMININO"] = "feminino";
    Gender["OUTRO"] = "outro";
    Gender["NAO_INFORMADO"] = "nao_informado";
})(Gender || (Gender = {}));
/** Tipos de endereço */
export var AddressType;
(function (AddressType) {
    AddressType["COMERCIAL"] = "comercial";
    AddressType["RESIDENCIAL"] = "residencial";
    AddressType["ENTREGA"] = "entrega";
    AddressType["COBRANCA"] = "cobranca";
    AddressType["OUTRO"] = "outro";
})(AddressType || (AddressType = {}));
/** Tipos de contato */
export var ContactType;
(function (ContactType) {
    ContactType["TELEFONE"] = "telefone";
    ContactType["CELULAR"] = "celular";
    ContactType["EMAIL"] = "email";
    ContactType["WHATSAPP"] = "whatsapp";
    ContactType["SITE"] = "site";
    ContactType["REDE_SOCIAL"] = "rede_social";
})(ContactType || (ContactType = {}));
/** Unidades de medida para produtos */
export var UnitOfMeasure;
(function (UnitOfMeasure) {
    UnitOfMeasure["UNIDADE"] = "un";
    UnitOfMeasure["QUILOGRAMA"] = "kg";
    UnitOfMeasure["GRAMA"] = "g";
    UnitOfMeasure["LITRO"] = "l";
    UnitOfMeasure["MILILITRO"] = "ml";
    UnitOfMeasure["METRO"] = "m";
    UnitOfMeasure["CENTIMETRO"] = "cm";
    UnitOfMeasure["METRO_QUADRADO"] = "m2";
    UnitOfMeasure["METRO_CUBICO"] = "m3";
    UnitOfMeasure["CAIXA"] = "cx";
    UnitOfMeasure["PACOTE"] = "pct";
    UnitOfMeasure["DUZIA"] = "dz";
    UnitOfMeasure["PAR"] = "par";
    UnitOfMeasure["HORA"] = "h";
    UnitOfMeasure["DIA"] = "dia";
    UnitOfMeasure["SERVICO"] = "sv";
})(UnitOfMeasure || (UnitOfMeasure = {}));
/** Tipos de movimentação de estoque */
export var StockMovementType;
(function (StockMovementType) {
    StockMovementType["ENTRADA"] = "entrada";
    StockMovementType["SAIDA"] = "saida";
    StockMovementType["TRANSFERENCIA"] = "transferencia";
    StockMovementType["AJUSTE"] = "ajuste";
    StockMovementType["DEVOLUCAO"] = "devolucao";
})(StockMovementType || (StockMovementType = {}));
/** Status de uma venda/pedido */
export var SaleStatus;
(function (SaleStatus) {
    SaleStatus["ORCAMENTO"] = "orcamento";
    SaleStatus["PENDENTE"] = "pendente";
    SaleStatus["APROVADO"] = "aprovado";
    SaleStatus["EM_PRODUCAO"] = "em_producao";
    SaleStatus["ENVIADO"] = "enviado";
    SaleStatus["ENTREGUE"] = "entregue";
    SaleStatus["CANCELADO"] = "cancelado";
    SaleStatus["DEVOLVIDO"] = "devolvido";
})(SaleStatus || (SaleStatus = {}));
/** Formas de pagamento */
export var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["DINHEIRO"] = "dinheiro";
    PaymentMethod["CARTAO_CREDITO"] = "cartao_credito";
    PaymentMethod["CARTAO_DEBITO"] = "cartao_debito";
    PaymentMethod["PIX"] = "pix";
    PaymentMethod["BOLETO"] = "boleto";
    PaymentMethod["TRANSFERENCIA"] = "transferencia";
    PaymentMethod["CHEQUE"] = "cheque";
    PaymentMethod["CREDIARIO"] = "crediario";
    PaymentMethod["VALE"] = "vale";
})(PaymentMethod || (PaymentMethod = {}));
/** Status de pagamento */
export var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDENTE"] = "pendente";
    PaymentStatus["PAGO"] = "pago";
    PaymentStatus["PARCIAL"] = "parcial";
    PaymentStatus["ATRASADO"] = "atrasado";
    PaymentStatus["CANCELADO"] = "cancelado";
    PaymentStatus["ESTORNADO"] = "estornado";
})(PaymentStatus || (PaymentStatus = {}));
/** Tipos de conta financeira */
export var AccountType;
(function (AccountType) {
    AccountType["CONTA_CORRENTE"] = "conta_corrente";
    AccountType["CONTA_POUPANCA"] = "conta_poupanca";
    AccountType["CAIXA"] = "caixa";
    AccountType["INVESTIMENTO"] = "investimento";
    AccountType["CARTAO_CREDITO"] = "cartao_credito";
    AccountType["OUTRO"] = "outro";
})(AccountType || (AccountType = {}));
/** Categorias de transações financeiras */
export var TransactionCategory;
(function (TransactionCategory) {
    TransactionCategory["RECEITA"] = "receita";
    TransactionCategory["DESPESA"] = "despesa";
    TransactionCategory["INVESTIMENTO"] = "investimento";
    TransactionCategory["TRANSFERENCIA"] = "transferencia";
    TransactionCategory["AJUSTE"] = "ajuste";
})(TransactionCategory || (TransactionCategory = {}));
/** Subcategorias padrão */
export var TransactionSubcategory;
(function (TransactionSubcategory) {
    // Receitas
    TransactionSubcategory["VENDAS"] = "vendas";
    TransactionSubcategory["SERVICOS"] = "servicos";
    TransactionSubcategory["COMISSOES"] = "comissoes";
    TransactionSubcategory["RENDIMENTOS"] = "rendimentos";
    TransactionSubcategory["REEMBOLSOS"] = "reembolsos";
    TransactionSubcategory["OUTRAS_RECEITAS"] = "outras_receitas";
    // Despesas
    TransactionSubcategory["ALUGUEL"] = "aluguel";
    TransactionSubcategory["SALARIOS"] = "salarios";
    TransactionSubcategory["ENCARGOS"] = "encargos";
    TransactionSubcategory["IMPOSTOS"] = "impostos";
    TransactionSubcategory["FORNECEDORES"] = "fornecedores";
    TransactionSubcategory["MARKETING"] = "marketing";
    TransactionSubcategory["TI"] = "ti";
    TransactionSubcategory["ESCRITORIO"] = "escritorio";
    TransactionSubcategory["TRANSPORTE"] = "transporte";
    TransactionSubcategory["UTILIDADES"] = "utilidades";
    TransactionSubcategory["MANUTENCAO"] = "manutencao";
    TransactionSubcategory["TAXAS"] = "taxas";
    TransactionSubcategory["OUTRAS_DESPESAS"] = "outras_despesas";
})(TransactionSubcategory || (TransactionSubcategory = {}));
/** Perfis de usuário padrão */
export var SystemRole;
(function (SystemRole) {
    SystemRole["ADMIN"] = "admin";
    SystemRole["GERENTE"] = "gerente";
    SystemRole["SUPERVISOR"] = "supervisor";
    SystemRole["OPERADOR"] = "operador";
    SystemRole["FINANCEIRO"] = "financeiro";
    SystemRole["VENDEDOR"] = "vendedor";
    SystemRole["ESTOQUISTA"] = "estoquista";
    SystemRole["CAIXA"] = "caixa";
    SystemRole["LEITURA"] = "leitura";
})(SystemRole || (SystemRole = {}));
/** Ações de permissão */
export var PermissionAction;
(function (PermissionAction) {
    PermissionAction["CRIAR"] = "criar";
    PermissionAction["LER"] = "ler";
    PermissionAction["ATUALIZAR"] = "atualizar";
    PermissionAction["EXCLUIR"] = "excluir";
    PermissionAction["EXPORTAR"] = "exportar";
    PermissionAction["IMPORTAR"] = "importar";
    PermissionAction["APROVAR"] = "aprovar";
    PermissionAction["CANCELAR"] = "cancelar";
})(PermissionAction || (PermissionAction = {}));
/** Módulos do sistema */
export var SystemModule;
(function (SystemModule) {
    SystemModule["DASHBOARD"] = "dashboard";
    SystemModule["CADASTROS"] = "cadastros";
    SystemModule["CLIENTES"] = "clientes";
    SystemModule["FORNECEDORES"] = "fornecedores";
    SystemModule["PRODUTOS"] = "produtos";
    SystemModule["FINANCEIRO"] = "financeiro";
    SystemModule["CONTAS_PAGAR"] = "contas_pagar";
    SystemModule["CONTAS_RECEBER"] = "contas_receber";
    SystemModule["FLUXO_CAIXA"] = "fluxo_caixa";
    SystemModule["ESTOQUE"] = "estoque";
    SystemModule["VENDAS"] = "vendas";
    SystemModule["PDV"] = "pdv";
    SystemModule["ORCAMENTOS"] = "orcamentos";
    SystemModule["COMPRAS"] = "compras";
    SystemModule["RELATORIOS"] = "relatorios";
    SystemModule["CONFIGURACOES"] = "configuracoes";
    SystemModule["USUARIOS"] = "usuarios";
    SystemModule["PERMISSOES"] = "permissoes";
    SystemModule["EMPRESAS"] = "empresas";
    SystemModule["AUDITORIA"] = "auditoria";
    SystemModule["BACKUP"] = "backup";
    // Módulos de negócio específicos
    SystemModule["MESAS"] = "mesas";
    SystemModule["COMANDA"] = "comanda";
    SystemModule["COZINHA"] = "cozinha";
    SystemModule["ENTREGA"] = "entrega";
    SystemModule["PACIENTES"] = "pacientes";
    SystemModule["PRONTUARIOS"] = "prontuarios";
    SystemModule["CONSULTAS"] = "consultas";
    SystemModule["AGENDA"] = "agenda";
    SystemModule["CONVENIOS"] = "convenios";
    SystemModule["QUARTOS"] = "quartos";
    SystemModule["RESERVAS"] = "reservas";
    SystemModule["HOSPEDAGEM"] = "hospedagem";
    SystemModule["IMOVEIS"] = "imoveis";
    SystemModule["CONTRATOS"] = "contratos";
    SystemModule["ALUNOS"] = "alunos";
    SystemModule["TREINOS"] = "treinos";
    SystemModule["MATRICULAS"] = "matriculas";
})(SystemModule || (SystemModule = {}));
/** Níveis de experiência do usuário */
export var UserExperienceLevel;
(function (UserExperienceLevel) {
    UserExperienceLevel["INICIANTE"] = "iniciante";
    UserExperienceLevel["INTERMEDIARIO"] = "intermediario";
    UserExperienceLevel["AVANCADO"] = "avancado";
    UserExperienceLevel["ESPECIALISTA"] = "especialista";
})(UserExperienceLevel || (UserExperienceLevel = {}));
/** Tipos de tour guiado */
export var TourType;
(function (TourType) {
    TourType["PRIMEIRO_ACESSO"] = "primeiro_acesso";
    TourType["MODULO"] = "modulo";
    TourType["FUNCIONALIDADE"] = "funcionalidade";
    TourType["ATALHO"] = "atalho";
})(TourType || (TourType = {}));
/** Frequência de backup */
export var BackupFrequency;
(function (BackupFrequency) {
    BackupFrequency["DIARIO"] = "diario";
    BackupFrequency["SEMANAL"] = "semanal";
    BackupFrequency["MENSAL"] = "mensal";
    BackupFrequency["MANUAL"] = "manual";
})(BackupFrequency || (BackupFrequency = {}));
/** Tipos de log de auditoria */
export var AuditAction;
(function (AuditAction) {
    AuditAction["LOGIN"] = "login";
    AuditAction["LOGOUT"] = "logout";
    AuditAction["CRIAR"] = "criar";
    AuditAction["ATUALIZAR"] = "atualizar";
    AuditAction["EXCLUIR"] = "excluir";
    AuditAction["EXPORTAR"] = "exportar";
    AuditAction["IMPORTAR"] = "importar";
    AuditAction["ALTERAR_SENHA"] = "alterar_senha";
    AuditAction["ALTERAR_PERMISSOES"] = "alterar_permissoes";
    AuditAction["BACKUP"] = "backup";
    AuditAction["RESTORE"] = "restore";
})(AuditAction || (AuditAction = {}));
/** Regime tributário (apenas informativo, sem cálculos fiscais) */
export var TaxRegime;
(function (TaxRegime) {
    TaxRegime["SIMPLES_NACIONAL"] = "simples_nacional";
    TaxRegime["LUCRO_PRESUMIDO"] = "lucro_presumido";
    TaxRegime["LUCRO_REAL"] = "lucro_real";
    TaxRegime["MEI"] = "mei";
    TaxRegime["ISENTO"] = "isento";
})(TaxRegime || (TaxRegime = {}));
/** Estados brasileiros */
export var BrazilianState;
(function (BrazilianState) {
    BrazilianState["AC"] = "AC";
    BrazilianState["AL"] = "AL";
    BrazilianState["AP"] = "AP";
    BrazilianState["AM"] = "AM";
    BrazilianState["BA"] = "BA";
    BrazilianState["CE"] = "CE";
    BrazilianState["DF"] = "DF";
    BrazilianState["ES"] = "ES";
    BrazilianState["GO"] = "GO";
    BrazilianState["MA"] = "MA";
    BrazilianState["MT"] = "MT";
    BrazilianState["MS"] = "MS";
    BrazilianState["MG"] = "MG";
    BrazilianState["PA"] = "PA";
    BrazilianState["PB"] = "PB";
    BrazilianState["PR"] = "PR";
    BrazilianState["PE"] = "PE";
    BrazilianState["PI"] = "PI";
    BrazilianState["RJ"] = "RJ";
    BrazilianState["RN"] = "RN";
    BrazilianState["RS"] = "RS";
    BrazilianState["RO"] = "RO";
    BrazilianState["RR"] = "RR";
    BrazilianState["SC"] = "SC";
    BrazilianState["SP"] = "SP";
    BrazilianState["SE"] = "SE";
    BrazilianState["TO"] = "TO";
})(BrazilianState || (BrazilianState = {}));
//# sourceMappingURL=index.js.map