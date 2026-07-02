import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class WebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private connectedClients;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    notifyUser(userId: string, event: string, data: unknown): void;
    notifyTenant(tenantId: string, event: string, data: unknown): void;
    handlePing(): {
        event: string;
        timestamp: string;
    };
}
