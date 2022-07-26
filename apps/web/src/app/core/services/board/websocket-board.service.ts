import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketBoardService {

  public socket: Socket;

  public createWSConnection(token: string) {
    this.socket = io('/board', {
      path: '/api/socket/connect',
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: token
          }
        }
      },
      withCredentials: true
    });

    this.socket.on('disconnect', (reason) => {
      console.error('ws отключение', reason);
      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });

    this.socket.on('board_to_client', (data) => {
      console.log(data);
    });
  }

  public test() {
    this.socket.emit('board_to_server', "test");
  }

}
