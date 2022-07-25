import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway()
export class BoardGateway {

  @SubscribeMessage('board')
  public test(@MessageBody() data: string) {
    return data;
  }

}
