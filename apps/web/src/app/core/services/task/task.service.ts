import { Injectable } from '@angular/core';
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";
import { BaseService } from "@scrum/web/core/services/base.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TaskService extends BaseService {
  protected override baseUrl = '/task';

  public findAllByBoard(boardId: string): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(`${this.baseUrl}/board/${boardId}`);
  }

}
