import { UseGuards } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from "@nestjs/websockets";
import { WsGuard } from "@scrum/api/core/guards/ws.guard";
import { BoardService } from "@scrum/api/modules/board/board.service";
import { UserService } from "@scrum/api/modules/user/user.service";
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { WebsocketResultDto } from "@scrum/shared/dtos/websocket/websocket.result.dto";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  namespace: 'board',
  path: '/api/socket/board',
  cors:
  {
    methods: ['GET', 'POST'],
    credentials: true
  }
})
export class BoardGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() public server: Server;

  public constructor(private readonly userService: UserService,
                     private readonly boardService: BoardService) {
  }

  @UseGuards(WsGuard)
  public handleConnection(@ConnectedSocket() client: Socket) {
    client.join(client.handshake.query.boardId);
  }

  public handleDisconnect(@ConnectedSocket() client: Socket) {
    client.leave(client.handshake.query.boardId as string);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('getBoard')
  public async getBoard(@MessageBody() data: { boardId: string }, @ConnectedSocket() client: Socket): Promise<WebsocketResultDto<BoardDto>> {
    const user = await this.userService.getUserByAuthorization(client.handshake.headers.authorization);

    const entity = await this.boardService.findById(data.boardId);
    if (!entity) {
      throw new WsException("Нет такого объекта!");
    }

    if (entity.createdUser?.id !== user.id && entity.users.findIndex((_user) => _user.id === user.id) === -1) {
      throw new WsException("Нет доступа!");
    }
    return { success: true, error: '', result: entity };
  }

  public sendUpdatedBoard(boardId: string) {
    this.server.in(boardId).emit('updatedBoard');
  }

}
