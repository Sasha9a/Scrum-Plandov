import { Injectable } from '@angular/core';
import { TaskDto } from '@scrum/shared/dtos/task/task.dto';
import { TaskFormDto } from '@scrum/shared/dtos/task/task.form.dto';
import { WsNameEnum } from '@scrum/shared/enums/ws-name.enum';
import { WebsocketBaseService } from '@scrum/web/core/services/websocket-base.service';
import { Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketTaskService extends WebsocketBaseService {
  public onCreateTask$: Subject<null> = new Subject();
  public onUpdateTask$: Subject<null> = new Subject();
  public onDeleteTask$: Subject<null> = new Subject();

  public createWSConnection(token: string, boardId: string) {
    this.socket = io('/task', {
      path: '/api/socket/task',
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: token
          }
        }
      },
      query: {
        boardId: boardId
      },
      withCredentials: true
    });

    this.socket.on('connect', () => {
      console.log('Connect');
    });

    this.socket.on('connect_error', (err) => {
      console.log(err);
    });

    this.socket.on('disconnect', (reason) => {
      console.error('ws отключение', reason);
      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });

    this.socket.on(WsNameEnum.onCreateTask, () => {
      this.onCreateTask$.next(null);
    });

    this.socket.on(WsNameEnum.onUpdateTask, () => {
      this.onUpdateTask$.next(null);
    });

    this.socket.on(WsNameEnum.onDeleteTask, () => {
      this.onDeleteTask$.next(null);
    });
  }

  public createTask(payload: { boardId: string; body: TaskFormDto }): Observable<TaskDto> {
    return this.emitAsObservable(WsNameEnum.createTask, payload);
  }

  public updateTask(payload: { taskId: string; boardId: string; body: TaskFormDto }): Observable<TaskDto> {
    return this.emitAsObservable(WsNameEnum.updateTask, payload);
  }

  public deleteTask(payload: { taskId: string; boardId: string }): Observable<null> {
    return this.emitAsObservable(WsNameEnum.deleteTask, payload);
  }
}
