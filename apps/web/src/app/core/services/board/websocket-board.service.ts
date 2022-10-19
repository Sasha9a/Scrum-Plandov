import { Injectable } from '@angular/core';
import { BoardDto } from '@scrum/shared/dtos/board/board.dto';
import { BoardFormDto } from '@scrum/shared/dtos/board/board.form.dto';
import { WsNameEnum } from '@scrum/shared/enums/ws-name.enum';
import { WebsocketBaseService } from '@scrum/web/core/services/websocket-base.service';
import { Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketBoardService extends WebsocketBaseService {
  public onUpdateBoard$: Subject<null> = new Subject();
  public onDeleteBoard$: Subject<null> = new Subject();

  public createWSConnection(token: string, boardId: string) {
    this.socket = io('/board', {
      path: '/api/socket/board',
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

    this.socket.on(WsNameEnum.onUpdateBoard, () => {
      this.onUpdateBoard$.next(null);
    });

    this.socket.on(WsNameEnum.onDeleteBoard, () => {
      this.onDeleteBoard$.next(null);
    });
  }

  public updateBoard(payload: { boardId: string; body: BoardFormDto }): Observable<BoardDto> {
    return this.emitAsObservable(WsNameEnum.updateBoard, payload);
  }

  public startSprint(payload: { sprintId: string; boardId: string }): Observable<null> {
    return this.emitAsObservable(WsNameEnum.startSprint, payload);
  }

  public completedSprint(payload: { sprintId: string; boardId: string }): Observable<null> {
    return this.emitAsObservable(WsNameEnum.completedSprint, payload);
  }

  public deleteBoard(payload: { boardId: string }): Observable<null> {
    return this.emitAsObservable(WsNameEnum.deleteBoard, payload);
  }
}
