import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
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

  @SubscribeMessage('board_to_server')
  public test(@MessageBody() data: string) {
    console.log(data);
    this.server.emit('board_to_client', data);
  }

}
