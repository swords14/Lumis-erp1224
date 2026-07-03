"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantController = void 0;
const common_1 = require("@nestjs/common");
const tenant_service_1 = require("./tenant.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let TenantController = class TenantController {
    tenantService;
    constructor(tenantService) {
        this.tenantService = tenantService;
    }
    async findAll() {
        return this.tenantService.findAll();
    }
    async getMe(req) {
        return this.tenantService.findById(req.user.tenantId);
    }
    async findById(id) {
        return this.tenantService.findById(id);
    }
    async create(data) {
        return this.tenantService.create(data);
    }
    async updateMe(body, req) {
        return this.tenantService.update(req.user.tenantId, body);
    }
};
exports.TenantController = TenantController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "updateMe", null);
exports.TenantController = TenantController = __decorate([
    (0, common_1.Controller)('tenants'),
    __metadata("design:paramtypes", [tenant_service_1.TenantService])
], TenantController);
//# sourceMappingURL=tenant.controller.js.map