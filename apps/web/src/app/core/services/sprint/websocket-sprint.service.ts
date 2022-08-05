import { Injectable } from '@angular/core';
import { io, Socket } from "socket.io-client";
import { Observable, Subject } from "rxjs";
import { WebsocketResultDto } from "@scrum/shared/dtos/websocket/websocket.result.dto";
import { SprintTasksInfoDto } from "@scrum/shared/dtos/sprint/sprint.tasks.info.dto";

@Injectable({
  providedIn: 'root'
})
export class WebsocketSprintService {

  public socket: Socket;

  public updated$: Subject<SprintTasksInfoDto[]> = new Subject();

  public createWSConnection(token: string, boardId: string) {
    this.socket = io('/sprint', {
      path: '/api/socket/sprint',
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

    this.socket.on('updated', () => {
      console.log('updated');
      this.updated$.next(null);
    });
  }

  public findAllByBoard(payload: { boardId: string }): Observable<SprintTasksInfoDto[]> {
    return this.emitAsObservable('findAllByBoard', payload);
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
