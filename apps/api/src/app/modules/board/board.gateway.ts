import { UseGuards } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { WsGuard } from "@scrum/api/core/guards/ws.guard";
import { Server } from "socket.io";

@WebSocketGateway({
  namespace: 'board',
  path: '/api/socket/connect',
  cors:
  {
    methods: ['GET', 'POST'],
    credentials: true
  }
})
export class BoardGateway {

  @WebSocketServer() public server: Server;

  @UseGuards(WsGuard)
  @SubscribeMessage('board_to_server')
  public test(@MessageBody() data: string) {
    console.log(data);
    this.server.emit('board_to_client', data);
  }

}
