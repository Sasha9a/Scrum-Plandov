import { forwardRef, Inject, UseGuards } from "@nestjs/common";
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
import { WsNameEnum } from "@scrum/shared/enums/ws-name.enum";
import { BoardFormDto } from "@scrum/shared/dtos/board/board.form.dto";
import { ColumnBoardFormDto } from "@scrum/shared/dtos/board/column.board.form.dto";
import { TaskService } from "@scrum/api/modules/task/task.service";
import { BaseController } from "@scrum/api/core/controllers/base.controller";
import { ColumnBoardService } from "@scrum/api/modules/column-board/column-board.service";

@WebSocketGateway({
  namespace: 'board',
  path: '/api/socket/board',
  cors:
  {
    methods: ['GET', 'POST', 'PUT'],
    credentials: true
  }
})
export class BoardGateway extends BaseController implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() public server: Server;

  private clients: Socket[] = [];

  public constructor(private readonly userService: UserService,
                     private readonly boardService: BoardService,
                     private readonly boardColumnService: ColumnBoardService,
                     @Inject(forwardRef(() => TaskService)) private readonly taskService: TaskService) {
    super();
  }

  @UseGuards(WsGuard)
  public handleConnection(@ConnectedSocket() client: Socket) {
    client.join(client.handshake.query.boardId);
    this.clients.push(client);
    client.send('Ok');
  }

  public handleDisconnect(@ConnectedSocket() client: Socket) {
    client.leave(client.handshake.query.boardId as string);
    this.clients = this.clients.filter((_client) => _client.id !== client.id);
    client.send('Ok');
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(WsNameEnum.getBoard)
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

  @UseGuards(WsGuard)
  @SubscribeMessage(WsNameEnum.updateBoard)
  public async updateBoard(@MessageBody() data: { boardId: string, body: BoardFormDto }, @ConnectedSocket() client: Socket): Promise<WebsocketResultDto<BoardDto>> {
    const bodyParams = this.validate<BoardFormDto>(data.body, BoardFormDto);
    const user = await this.userService.getUserByAuthorization(client.handshake.headers.authorization);

    const userEntity = await this.userService.findById(user._id);
    if (!userEntity) {
      throw new WsException("Нет такого аккаунта");
    }

    let board = await this.boardService.findById(data.boardId);
    if (!board) {
      throw new WsException("Нет такого объекта!");
    }

    if (board.createdUser?.id !== user.id) {
      throw new WsException("Нет прав");
    }

    for (const column of board.columns) {
      if (bodyParams.columns.findIndex((_column) => _column['_id'] === column.id) === -1) {
        await this.boardColumnService.delete(column._id);
      }
    }

    for (const column of bodyParams.columns) {
      if (column['_id']) {
        await this.boardColumnService.update<ColumnBoardFormDto>(column['_id'], column);
      } else {
        const entityColumn = await this.boardColumnService.create<ColumnBoardFormDto>(column);
        column['_id'] = entityColumn._id;
      }
    }

    board = await this.boardService.findById(data.boardId);
    let tasks = await this.taskService.findAll({ board: board, status: { $nin: board.columns.map((_column) => _column._id) } });
    for (const task of tasks) {
      task.status = board.columns[0];
      await task.save();
    }

    tasks = await this.taskService.findAll({ board: board, executor: { $nin: [...bodyParams.users.map((_user) => _user._id), board.createdUser?._id], $exists: true, $ne: null } });
    for (const task of tasks) {
      task.executor = null;
      await task.save();
    }

    const entity = await this.boardService.update<BoardFormDto>(data.boardId, bodyParams);
    this.sendUpdatedBoard(data.boardId);
    return { success: true, error: '', result: entity };
  }

  public sendUpdatedBoard(boardId: string) {
    this.clients.forEach((client) => {
      client.broadcast.in(boardId).emit(WsNameEnum.updatedBoard);
    });
    // this.server.in(boardId).emit(WsNameEnum.updatedBoard);
  }

}
