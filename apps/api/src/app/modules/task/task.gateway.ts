import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { BaseController } from '@scrum/api/core/controllers/base.controller';
import { WsGuard } from '@scrum/api/core/guards/ws.guard';
import { JobRecordService } from '@scrum/api/modules/job-record/job.record.service';
import { TaskService } from '@scrum/api/modules/task/task.service';
import { UserService } from '@scrum/api/modules/user/user.service';
import { JobRecordDto } from '@scrum/shared/dtos/job-record/job.record.dto';
import { JobRecordFormDto } from '@scrum/shared/dtos/job-record/job.record.form.dto';
import { TaskDto } from '@scrum/shared/dtos/task/task.dto';
import { TaskFormDto } from '@scrum/shared/dtos/task/task.form.dto';
import { WebsocketResultDto } from '@scrum/shared/dtos/websocket/websocket.result.dto';
import { WsNameEnum } from '@scrum/shared/enums/ws-name.enum';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'task',
  path: '/api/socket/task',
  cors: {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
})
export class TaskGateway extends BaseController implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;

  public constructor(
    private readonly userService: UserService,
    private readonly taskService: TaskService,
    @Inject(forwardRef(() => JobRecordService)) private readonly jobRecordService: JobRecordService
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
  @SubscribeMessage(WsNameEnum.createTask)
  public async createTask(
    @MessageBody() data: { boardId: string; body: TaskFormDto },
    @ConnectedSocket() client: Socket
  ): Promise<WebsocketResultDto<TaskDto>> {
    const user = await this.userService.getUserByAuthorization(client.handshake.headers.authorization);
    user._id = user.id;

    const result = await this.taskService.createTask(data.body, user);
    if (result?.error) {
      console.error(result.error);
      return { success: false, error: result.error, result: null };
    }
    if (result?.entity) {
      client.broadcast.to(data.boardId).emit(WsNameEnum.onCreateTask);
      return { success: true, error: '', result: result.entity };
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(WsNameEnum.createJobRecord)
  public async createJobRecord(
    @MessageBody() data: { boardId: string; body: JobRecordFormDto },
    @ConnectedSocket() client: Socket
  ): Promise<WebsocketResultDto<JobRecordDto>> {
    const user = await this.userService.getUserByAuthorization(client.handshake.headers.authorization);
    user._id = user.id;

    const result = await this.jobRecordService.createJobRecord(data.body, user);
    if (result?.error) {
      console.error(result.error);
      return { success: false, error: result.error, result: null };
    }
    if (result?.entity) {
      client.broadcast.to(data.boardId).emit(WsNameEnum.onUpdateTask);
      return { success: true, error: '', result: result.entity };
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(WsNameEnum.updateTask)
  public async updateTask(
    @MessageBody() data: { taskId: string; boardId: string; body: TaskFormDto },
    @ConnectedSocket() client: Socket
  ): Promise<WebsocketResultDto<TaskDto>> {
    const user = await this.userService.getUserByAuthorization(client.handshake.headers.authorization);
    user._id = user.id;

    const result = await this.taskService.updateTask(data.taskId, data.body, user);
    if (result?.error) {
      console.error(result.error);
      return { success: false, error: result.error, result: null };
    }
    if (result?.entity) {
      client.broadcast.to(data.boardId).emit(WsNameEnum.onUpdateTask);
      return { success: true, error: '', result: result.entity };
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(WsNameEnum.deleteTask)
  public async deleteTask(
    @MessageBody() data: { taskId: string; boardId: string },
    @ConnectedSocket() client: Socket
  ): Promise<WebsocketResultDto<null>> {
    const user = await this.userService.getUserByAuthorization(client.handshake.headers.authorization);
    user._id = user.id;

    const result = await this.taskService.deleteTask(data.taskId, user);
    if (result?.error) {
      console.error(result.error);
      return { success: false, error: result.error, result: null };
    }
    client.broadcast.to(data.boardId).emit(WsNameEnum.onDeleteTask);
    return { success: true, error: '', result: null };
  }
}
