import { UseGuards } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { WsGuard } from "@scrum/api/core/guards/ws.guard";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  namespace: 'board_dashboard',
  path: '/api/socket/connect',
  cors:
  {
    methods: ['GET', 'POST'],
    credentials: true
  }
})
export class BoardDashboardGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() public server: Server;

  @UseGuards(WsGuard)
  public handleConnection(client: Socket) {
    client.join(client.handshake.query.room);
  }

  public handleDisconnect(client: Socket) {
    client.leave(client.handshake.query.room as string);
  }

}
