import { Injectable } from '@angular/core';
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
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

}
