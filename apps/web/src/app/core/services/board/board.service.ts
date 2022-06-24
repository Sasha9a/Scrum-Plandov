import { Injectable } from '@angular/core';
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { BaseService } from "@scrum/web/core/services/base.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BoardService extends BaseService {
  protected override baseUrl = '/board';

  public findByMy(): Observable<BoardDto[]> {
    return this.http.get<BoardDto[]>(`${this.baseUrl}/my`);
  }

  public leave(id: string, body: { user?: UserDto }): Observable<null> {
    return this.http.post<null>(`${this.baseUrl}/leave/${id}`, body);
  }

  public findAllUsersByBoard(boardId: string): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.baseUrl}/users/${boardId}`);
  }

}
