import { UseGuards } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer, WsException
} from "@nestjs/websockets";
import { WsGuard } from "@scrum/api/core/guards/ws.guard";
import { BoardService } from "@scrum/api/modules/board/board.service";
import { SprintService } from "@scrum/api/modules/sprint/sprint.service";
import { TaskService } from "@scrum/api/modules/task/task.service";
import { UserService } from "@scrum/api/modules/user/user.service";
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";
import { WebsocketResultDto } from "@scrum/shared/dtos/websocket/websocket.result.dto";
import { Server, Socket } from "socket.io";
import { TaskFormDto } from "@scrum/shared/dtos/task/task.form.dto";
import fs from "fs";
import moment from "moment-timezone";
import { BaseController } from "@scrum/api/core/controllers/base.controller";
import { FileService } from "@scrum/api/modules/file/file.service";

@WebSocketGateway({
  namespace: 'sprint_dashboard',
  path: '/api/socket/sprint_dashboard',
  cors:
    {
      methods: ['GET', 'POST', 'PUT'],
      credentials: true
    }
})
export class SprintDashboardGateway extends BaseController implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() public server: Server;

  private clients: Socket[] = [];

  public constructor(private readonly userService: UserService,
                     private readonly sprintService: SprintService,
                     private readonly boardService: BoardService,
                     private readonly taskService: TaskService,
                     private readonly fileService: FileService) {
    super();
  }

  @UseGuards(WsGuard)
  public handleConnection(@ConnectedSocket() client: Socket) {
    client.join(client.handshake.query.sprintId);
    this.clients.push(client);
    client.send('Ok');
  }

  public handleDisconnect(@ConnectedSocket() client: Socket) {
    client.leave(client.handshake.query.sprintId as string);
    this.clients = this.clients.filter((_client) => _client.id !== client.id);
    client.send('Ok');
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('findByIdAllTasks')
  public async findByIdAllTasks(@MessageBody() data: { sprintId: string }, @ConnectedSocket() client: Socket): Promise<WebsocketResultDto<TaskDto[]>> {
    const user = await this.userService.getUserByAuthorization(client.handshake.headers.authorization);

    const sprint = await this.sprintService.findById(data.sprintId);
    if (!sprint) {
      throw new WsException("Нет такого объекта!");
    }

    const board = await this.boardService.findById(sprint.board._id);
    if (!board) {
      throw new WsException("Нет такого объекта!");
    }

    if (board.createdUser?.id !== user.id && board.users.findIndex((_user) => _user.id === user.id) === -1) {
      throw new WsException("Нет доступа!");
    }

    const entities = await this.taskService.findAll({ board: board, sprint: sprint });
    return { success: true, error: '', result: entities };
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('updateTask')
  public async updateTask(@MessageBody() data: { taskId: string, body: TaskFormDto }, @ConnectedSocket() client: Socket): Promise<WebsocketResultDto<TaskDto>> {
    const bodyParams = this.validate<TaskFormDto>(data.body, TaskFormDto);
    const user = await this.userService.getUserByAuthorization(client.handshake.headers.authorization);

    const board = await this.boardService.findById(bodyParams.board._id);
    if (!board) {
      console.error("Нет такого объекта!");
      throw new WsException("Нет такого объекта!");
    }

    if (board.createdUser?.id !== user.id && board.users.findIndex((_user) => _user.id === user.id) === -1) {
      console.error("Нет доступа!");
      throw new WsException("Нет доступа!");
    }

    const oldTask = await this.taskService.findById(data.taskId);
    for (const file of oldTask.files) {
      if (bodyParams.files?.findIndex((_file) => _file._id === file.id) === -1) {
        await this.fileService.deleteFile(file?.path);
        if (fs.existsSync('./public/' + file?.path)) {
          fs.unlinkSync('./public/' + file?.path);
        }
      }
    }

    if (oldTask.grade !== bodyParams.grade) {
      bodyParams.left = bodyParams.grade - oldTask.spent;
      if (bodyParams.left < 0) {
        bodyParams.left = 0;
      }
    }

    bodyParams.updateDate = moment().toDate();
    const entity = await this.taskService.update<TaskFormDto>(data.taskId, bodyParams);
    this.sendUpdatedSprint(entity.sprint?.id, client);
    return { success: true, error: '', result: entity };
  }

  public sendUpdatedSprint(sprintId: string, client: Socket) {
    client.broadcast.to(sprintId).emit('updatedSprint');
  }

}
