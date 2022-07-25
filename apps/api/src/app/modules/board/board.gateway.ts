import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway(80, { namespace: 'board' })
export class BoardGateway {

  @SubscribeMessage('board')
  public test(@MessageBody() data: string) {
    return data;
  }

}
