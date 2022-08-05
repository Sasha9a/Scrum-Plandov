import { Injectable } from '@angular/core';
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";
import { WebsocketResultDto } from "@scrum/shared/dtos/websocket/websocket.result.dto";
import { Observable, Subject } from "rxjs";
import { io, Socket } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class WebsocketDashboardSprintService {

  public socket: Socket;

  public updatedSprintDashboardInfo$: Subject<TaskDto[]> = new Subject();

  public createWSConnection(token: string, sprintId: string) {
    this.socket = io('/sprint_dashboard', {
      path: '/api/socket/sprint_dashboard',
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: token
          }
        }
      },
      query: {
        sprintId: sprintId
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

    this.socket.on('updatedSprint', () => {
      console.log('updatedSprint');
      this.updatedSprintDashboardInfo$.next(null);
    });
  }

  public findByIdAllTasks(payload: { sprintId: string }): Observable<TaskDto[]> {
    return this.emitAsObservable('findByIdAllTasks', payload);
  }

  private emitAsObservable<T>(event: string, payload: any): Observable<T> {
    return new Observable((subscriber) => {
      this.socket.emit(event, payload, (response: WebsocketResultDto) => {
        if (response.success) {
          subscriber.next(response.result);
          subscriber.complete();
        }
        subscriber.error(response.error);
      });
    })
  }
}
