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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let WebSocketGateway = class WebSocketGateway {
    server;
    connectedClients = new Map();
    handleConnection(client) {
        const tenantId = client.handshake.query.tenantId;
        const userId = client.handshake.query.userId;
        if (tenantId) {
            client.join(`tenant:${tenantId}`);
        }
        if (userId) {
            client.join(`user:${userId}`);
            this.connectedClients.set(userId, client.id);
        }
    }
    handleDisconnect(client) {
        this.connectedClients.forEach((id, key) => {
            if (id === client.id)
                this.connectedClients.delete(key);
        });
    }
    notifyUser(userId, event, data) {
        this.server.to(`user:${userId}`).emit(event, data);
    }
    notifyTenant(tenantId, event, data) {
        this.server.to(`tenant:${tenantId}`).emit(event, data);
    }
    handlePing() {
        return { event: 'pong', timestamp: new Date().toISOString() };
    }
};
exports.WebSocketGateway = WebSocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebSocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebSocketGateway.prototype, "handlePing", null);
exports.WebSocketGateway = WebSocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*', credentials: true },
        namespace: '/ws',
    })
], WebSocketGateway);
//# sourceMappingURL=websocket.gateway.js.map