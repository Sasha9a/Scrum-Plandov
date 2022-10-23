import { Injectable } from '@angular/core';
import { WebsocketResultDto } from '@scrum/shared/dtos/websocket/websocket.result.dto';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io-client';
import { ErrorService } from '@scrum/web/core/services/error.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketBaseService {
  public socket: Socket;

  public constructor(private readonly errorService: ErrorService) {}

  protected emitAsObservable<T>(event: string, payload: any): Observable<T> {
    return new Observable((subscriber) => {
      this.socket.emit(event, payload, (response: WebsocketResultDto) => {
        if (response.success) {
          subscriber.next(response.result);
          subscriber.complete();
        } else {
          subscriber.error(response.error);
          this.errorService.addCustomError(response.error);
        }
      });
    });
  }
}
