import { Injectable } from '@angular/core';
import { WebsocketResultDto } from '@scrum/shared/dtos/websocket/websocket.result.dto';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketBaseService {
  public socket: Socket;

  protected emitAsObservable<T>(event: string, payload: any): Observable<T> {
    return new Observable((subscriber) => {
      this.socket.emit(event, payload, (response: WebsocketResultDto) => {
        if (response.success) {
          subscriber.next(response.result);
          subscriber.complete();
        }
        subscriber.error(response.error);
      });
    });
  }
}
