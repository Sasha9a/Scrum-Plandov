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

@WebSocketGateway({
  namespace: 'sprint_dashboard',
  path: '/api/socket/connect',
  cors:
    {
      methods: ['GET', 'POST'],
      credentials: true
    }
})
export class SprintDashboardGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() public server: Server;

  private clients: Socket[] = [];

  public constructor(private readonly userService: UserService,
                     private readonly sprintService: SprintService,
                     private readonly boardService: BoardService,
                     private readonly taskService: TaskService) {
  }

  @UseGuards(WsGuard)
  public handleConnection(client: Socket) {
    console.log(client.handshake.query);
    client.join(client.handshake.query.sprintId);
    this.clients.push(client);
  }

  public handleDisconnect(client: Socket) {
    client.leave(client.handshake.query.sprintId as string);
    this.clients = this.clients.filter((cl) => cl.id !== client.id);
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

  public sendUpdatedSprint(sprintId: string) {
    console.log(this.clients.length);
    this.clients.forEach((c) => {
      c.to(sprintId).emit('updatedSprint');
    });
  }

}
