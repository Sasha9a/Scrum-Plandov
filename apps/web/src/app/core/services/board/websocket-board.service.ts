import { Injectable } from '@angular/core';
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: 'root'
})
export class WebsocketBoardService {

  public constructor(private readonly socket: Socket) {
  }

  public test() {
    this.socket.on('board', (data) => {
      console.log(data);
    });

    this.socket.emit('board', "test");
  }

}
