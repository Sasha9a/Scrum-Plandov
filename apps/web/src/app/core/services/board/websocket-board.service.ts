import { Injectable } from '@angular/core';
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { WebsocketResultDto } from "@scrum/shared/dtos/websocket/websocket.result.dto";
import { Observable, Subject } from "rxjs";
import { io, Socket } from 'socket.io-client';
import { WsNameEnum } from "@scrum/shared/enums/ws-name.enum";
import { BoardFormDto } from "@scrum/shared/dtos/board/board.form.dto";

@Injectable({
  providedIn: 'root'
})
export class WebsocketBoardService {

  public socket: Socket;

  public updatedBoardInfo$: Subject<BoardDto> = new Subject();

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

    this.socket.on('updatedBoard', () => {
      console.log('updatedBoard');
      this.updatedBoardInfo$.next(null);
    });
  }

  public getBoard(payload: { boardId: string }): Observable<BoardDto> {
    return this.emitAsObservable(WsNameEnum.getBoard, payload);
  }

  public updateBoard(payload: { boardId: string, body: BoardFormDto }): Observable<BoardDto> {
    return this.emitAsObservable(WsNameEnum.updateBoard, payload);
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
