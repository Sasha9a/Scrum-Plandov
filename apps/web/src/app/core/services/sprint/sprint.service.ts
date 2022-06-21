import { Injectable } from '@angular/core';
import { SprintDto } from "@scrum/shared/dtos/sprint/sprint.dto";
import { BaseService } from "@scrum/web/core/services/base.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SprintService extends BaseService {
  protected override baseUrl = '/sprint';

  public findAllByBoard(boardId: string): Observable<SprintDto[]> {
    return this.http.get<SprintDto[]>(`${this.baseUrl}/board/${boardId}`);
  }
}
