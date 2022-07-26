import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketBoardDashboardService {

  public socket: Socket;

  public createWSConnection(token: string, boardId: string) {
    this.socket = io('/board_dashboard', {
      path: '/api/socket/connect',
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: token
          }
        }
      },
      query: {
        room: boardId
      },
      withCredentials: true
    });

    this.socket.on('disconnect', (reason) => {
      console.error('ws отключение', reason);
      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });
  }

}
