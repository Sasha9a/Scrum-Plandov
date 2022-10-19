import { forwardRef, Inject, UseGuards } from '@nestjs/common';
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
import { BaseController } from '@scrum/api/core/controllers/base.controller';
import { WsGuard } from '@scrum/api/core/guards/ws.guard';
import { BoardService } from '@scrum/api/modules/board/board.service';
import { ColumnBoardService } from '@scrum/api/modules/column-board/column-board.service';
import { FileService } from '@scrum/api/modules/file/file.service';
import { JobRecordService } from '@scrum/api/modules/job-record/job.record.service';
import { SprintService } from '@scrum/api/modules/sprint/sprint.service';
import { TaskService } from '@scrum/api/modules/task/task.service';
import { UserService } from '@scrum/api/modules/user/user.service';
import { BoardDto } from '@scrum/shared/dtos/board/board.dto';
import { BoardFormDto } from '@scrum/shared/dtos/board/board.form.dto';
import { WebsocketResultDto } from '@scrum/shared/dtos/websocket/websocket.result.dto';
import { WsNameEnum } from '@scrum/shared/enums/ws-name.enum';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'board',
  path: '/api/socket/board',
  cors: {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
})
export class BoardGateway extends BaseController implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;

  public constructor(
    private readonly userService: UserService,
    private readonly boardService: BoardService,
    private readonly boardColumnService: ColumnBoardService,
    private readonly fileService: FileService,
    @Inject(forwardRef(() => TaskService))
    private readonly taskService: TaskService,
    @Inject(forwardRef(() => SprintService))
    private readonly sprintService: SprintService,
    @Inject(forwardRef(() => JobRecordService))
    private readonly jobRecordService: JobRecordService
  ) {
    super();
  }

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
  @SubscribeMessage(WsNameEnum.updateBoard)
  public async updateBoard(
    @MessageBody() data: { boardId: string; body: BoardFormDto },
    @ConnectedSocket() client: Socket
  ): Promise<WebsocketResultDto<BoardDto>> {
    const user = await this.userService.getUserByAuthorization(client.handshake.headers.authorization);
    user._id = user.id;

    const result = await this.boardService.updateBoard(data.boardId, data.body, user);
    if (result?.error) {
      console.error(result.error);
      throw new WsException(result.error);
    }
    if (result?.entity) {
      client.broadcast.to(data.boardId).emit(WsNameEnum.onUpdateBoard);
      return { success: true, error: '', result: result.entity };
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(WsNameEnum.startSprint)
  public async startSprint(
    @MessageBody() data: { sprintId: string; boardId: string },
    @ConnectedSocket() client: Socket
  ): Promise<WebsocketResultDto<null>> {
    const user = await this.userService.getUserByAuthorization(client.handshake.headers.authorization);
    user._id = user.id;

    const result = await this.sprintService.startSprint(data.sprintId, user);
    if (result?.error) {
      console.error(result.error);
      throw new WsException(result.error);
    }
    client.broadcast.to(data.boardId).emit(WsNameEnum.onUpdateBoard);
    return { success: true, error: '', result: null };
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(WsNameEnum.completedSprint)
  public async completedSprint(
    @MessageBody() data: { sprintId: string; boardId: string },
    @ConnectedSocket() client: Socket
  ): Promise<WebsocketResultDto<null>> {
    const user = await this.userService.getUserByAuthorization(client.handshake.headers.authorization);
    user._id = user.id;

    const result = await this.sprintService.completedSprint(data.sprintId, user);
    if (result?.error) {
      console.error(result.error);
      throw new WsException(result.error);
    }
    client.broadcast.to(data.boardId).emit(WsNameEnum.onUpdateBoard);
    return { success: true, error: '', result: null };
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(WsNameEnum.deleteBoard)
  public async deleteBoard(@MessageBody() data: { boardId: string }, @ConnectedSocket() client: Socket): Promise<WebsocketResultDto<null>> {
    const user = await this.userService.getUserByAuthorization(client.handshake.headers.authorization);
    user._id = user.id;

    const result = await this.boardService.deleteBoard(data.boardId, user);
    if (result?.error) {
      console.error(result.error);
      throw new WsException(result.error);
    }
    client.broadcast.to(data.boardId).emit(WsNameEnum.onDeleteBoard);
    return { success: true, error: '', result: null };
  }
}
