import {
  ConnectedSocket, MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect, SubscribeMessage,
  WebSocketGateway,
  WebSocketServer, WsException
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserService } from "@scrum/api/modules/user/user.service";
import { SprintService } from "@scrum/api/modules/sprint/sprint.service";
import { BoardService } from "@scrum/api/modules/board/board.service";
import { TaskService } from "@scrum/api/modules/task/task.service";
import { UseGuards } from "@nestjs/common";
import { WsGuard } from "@scrum/api/core/guards/ws.guard";
import { WebsocketResultDto } from "@scrum/shared/dtos/websocket/websocket.result.dto";
import { SprintTasksInfoDto } from "@scrum/shared/dtos/sprint/sprint.tasks.info.dto";
import { SprintWorkUserInfoDto } from "@scrum/shared/dtos/sprint/sprint.work.user.info.dto";

@WebSocketGateway({
  namespace: 'sprint',
  path: '/api/socket/sprint',
  cors:
    {
      methods: ['GET', 'POST'],
      credentials: true
    }
})
export class SprintGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() public server: Server;

  public constructor(private readonly userService: UserService,
                     private readonly sprintService: SprintService,
                     private readonly boardService: BoardService,
                     private readonly taskService: TaskService) {
  }

  @UseGuards(WsGuard)
  public handleConnection(@ConnectedSocket() client: Socket) {
    client.join(client.handshake.query.boardId);
  }

  public handleDisconnect(@ConnectedSocket() client: Socket) {
    client.leave(client.handshake.query.boardId as string);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('findAllByBoard')
  public async findAllByBoard(@MessageBody() data: { boardId: string }, @ConnectedSocket() client: Socket): Promise<WebsocketResultDto<SprintTasksInfoDto[]>> {
    const user = await this.userService.getUserByAuthorization(client.handshake.headers.authorization);
    const results: SprintTasksInfoDto[] = [];

    const board = await this.boardService.findById(data.boardId);
    if (!board) {
      throw new WsException("Нет такого объекта!");
    }

    if (board.createdUser?.id !== user.id && board.users.findIndex((_user) => _user.id === user.id) === -1) {
      throw new WsException("Нет доступа!");
    }

    const sprints = await this.sprintService.findAll({ board: board, isCompleted: false });
    for (const sprint of sprints) {
      const tasks = await this.taskService.findAll({ board: board, sprint: sprint });
      const usersInfo: SprintWorkUserInfoDto[] = [];
      for (const task of tasks) {
        if (task.executor) {
          let userInfo = usersInfo.find((userInfo) => userInfo.user?._id === task.executor?._id);
          if (!userInfo) {
            userInfo = {
              user: task.executor,
              count: 1,
              grade: task.grade,
              left: task.left || 0
            };
            usersInfo.push(userInfo);
          } else {
            userInfo.count++;
            userInfo.grade += task.grade;
            userInfo.left += (task.left || 0);
          }
        }
      }
      results.push({
        sprint: sprint,
        tasks: tasks,
        notAssignedInfo: {
          count: tasks.reduce((sum, task) => !task.executor ? sum + 1 : sum, 0),
          grade: tasks.reduce((sum, task) => !task.executor ? sum + task.grade : sum, 0),
          left: tasks.reduce((sum, task) => !task.executor ? sum + (task.left || 0) : sum, 0)
        },
        usersInfo: usersInfo,
        sumInfo: {
          count: tasks.length,
          grade: tasks.reduce((sum, task) => sum + task.grade, 0),
          left: tasks.reduce((sum, task) => sum + (task.left || 0), 0)
        }
      });
    }

    const tasks = await this.taskService.findAll({ board: board, sprint: null });
    results.push({
      tasks: tasks
    });
    return { success: true, error: '', result: results };
  }

  public sendUpdated(boardId: string) {
    this.server.in(boardId).emit('updated');
  }

}
