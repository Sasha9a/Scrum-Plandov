import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketBoardService {

  public socket: Socket;

  public createWSConnection(token: string) {
    this.socket = io('ws://localhost:3333', {
      path: '/api/socket/connect',
      auth: {
        token: token
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

  public test() {
    this.socket.on('board', (data) => {
      console.log(data);
    });

    this.socket.emit('board', "test");
  }

}
