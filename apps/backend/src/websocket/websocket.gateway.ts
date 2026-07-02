import { WebSocketGateway as WSGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WSGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/ws',
})
export class WebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<string, string>();

  handleConnection(client: Socket) {
    const tenantId = client.handshake.query.tenantId as string;
    const userId = client.handshake.query.userId as string;
    if (tenantId) {
      client.join(`tenant:${tenantId}`);
    }
    if (userId) {
      client.join(`user:${userId}`);
      this.connectedClients.set(userId, client.id);
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.forEach((id, key) => {
      if (id === client.id) this.connectedClients.delete(key);
    });
  }

  notifyUser(userId: string, event: string, data: unknown) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  notifyTenant(tenantId: string, event: string, data: unknown) {
    this.server.to(`tenant:${tenantId}`).emit(event, data);
  }

  @SubscribeMessage('ping')
  handlePing() {
    return { event: 'pong', timestamp: new Date().toISOString() };
  }
}