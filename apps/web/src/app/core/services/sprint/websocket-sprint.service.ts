import { Injectable } from '@angular/core';
import { SprintDto } from '@scrum/shared/dtos/sprint/sprint.dto';
import { SprintFormDto } from '@scrum/shared/dtos/sprint/sprint.form.dto';
import { WsNameEnum } from '@scrum/shared/enums/ws-name.enum';
import { WebsocketBaseService } from '@scrum/web/core/services/websocket-base.service';
import { Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketSprintService extends WebsocketBaseService {
  public onCreateSprint$: Subject<null> = new Subject();
  public onUpdateSprint$: Subject<null> = new Subject();
  public onDeleteSprint$: Subject<null> = new Subject();

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

    this.socket.on(WsNameEnum.onCreateSprint, () => {
      this.onCreateSprint$.next(null);
    });

    this.socket.on(WsNameEnum.onUpdateSprint, () => {
      this.onUpdateSprint$.next(null);
    });

    this.socket.on(WsNameEnum.onDeleteSprint, () => {
      this.onDeleteSprint$.next(null);
    });
  }

  public createSprint(payload: { boardId: string; body: SprintFormDto }): Observable<SprintDto> {
    return this.emitAsObservable(WsNameEnum.createSprint, payload);
  }

  public updateSprint(payload: { sprintId: string; boardId: string; body: SprintFormDto }): Observable<SprintDto> {
    return this.emitAsObservable(WsNameEnum.updateSprint, payload);
  }

  public deleteSprint(payload: { boardId: string }): Observable<null> {
    return this.emitAsObservable(WsNameEnum.deleteSprint, payload);
  }
}
