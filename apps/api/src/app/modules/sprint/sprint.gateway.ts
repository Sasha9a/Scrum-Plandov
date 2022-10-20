import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from '@nestjs/websockets';
import { WsGuard } from '@scrum/api/core/guards/ws.guard';
import { SprintService } from '@scrum/api/modules/sprint/sprint.service';
import { UserService } from '@scrum/api/modules/user/user.service';
import { SprintDto } from '@scrum/shared/dtos/sprint/sprint.dto';
import { SprintFormDto } from '@scrum/shared/dtos/sprint/sprint.form.dto';
import { WebsocketResultDto } from '@scrum/shared/dtos/websocket/websocket.result.dto';
import { WsNameEnum } from '@scrum/shared/enums/ws-name.enum';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'sprint',
  path: '/api/socket/sprint',
  cors: {
    methods: ['GET', 'POST'],
    credentials: true
  }
})
export class SprintGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;

  public constructor(private readonly userService: UserService, private readonly sprintService: SprintService) {}

  @UseGuards(WsGuard)
  public handleConnection(@ConnectedSocket() client: Socket) {
    client.join(client.handshake.query.boardId);
    client.send('Ok');
  }

  public handleDisconnect(@ConnectedSocket() client: Socket) {
    client.leave(client.handshake.query.boardId as string);
    client.send('Ok');
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(WsNameEnum.createSprint)
  public async createSprint(
    @MessageBody() data: { boardId: string; body: SprintFormDto },
    @ConnectedSocket() client: Socket
  ): Promise<WebsocketResultDto<SprintDto>> {
    const user = await this.userService.getUserByAuthorization(client.handshake.headers.authorization);
    user._id = user.id;

    const result = await this.sprintService.createSprint(data.body, user);
    if (result?.error) {
      console.error(result.error);
      throw new WsException(result.error);
    }
    if (result?.entity) {
      client.broadcast.to(data.boardId).emit(WsNameEnum.onCreateSprint);
      return { success: true, error: '', result: result.entity };
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(WsNameEnum.updateSprint)
  public async updateSprint(
    @MessageBody() data: { sprintId: string; boardId: string; body: SprintFormDto },
    @ConnectedSocket() client: Socket
  ): Promise<WebsocketResultDto<SprintDto>> {
    const user = await this.userService.getUserByAuthorization(client.handshake.headers.authorization);
    user._id = user.id;

    const result = await this.sprintService.updateSprint(data.sprintId, data.body, user);
    if (result?.error) {
      console.error(result.error);
      throw new WsException(result.error);
    }
    if (result?.entity) {
      client.broadcast.to(data.boardId).emit(WsNameEnum.onUpdateSprint);
      return { success: true, error: '', result: result.entity };
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(WsNameEnum.deleteSprint)
  public async deleteSprint(
    @MessageBody() data: { sprintId: string; boardId: string },
    @ConnectedSocket() client: Socket
  ): Promise<WebsocketResultDto<null>> {
    const user = await this.userService.getUserByAuthorization(client.handshake.headers.authorization);
    user._id = user.id;

    const result = await this.sprintService.deleteSprint(data.sprintId, user);
    if (result?.error) {
      console.error(result.error);
      throw new WsException(result.error);
    }
    client.broadcast.to(data.boardId).emit(WsNameEnum.onDeleteSprint);
    return { success: true, error: '', result: null };
  }
}
