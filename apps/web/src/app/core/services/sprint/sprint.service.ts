import { Injectable } from '@angular/core';
import { SprintDto } from '@scrum/shared/dtos/sprint/sprint.dto';
import { SprintTasksInfoDto } from '@scrum/shared/dtos/sprint/sprint.tasks.info.dto';
import { TaskDto } from '@scrum/shared/dtos/task/task.dto';
import { BaseService } from '@scrum/web/core/services/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SprintService extends BaseService {
  protected override baseUrl = '/sprint';

  public findAllByBoard(boardId: string): Observable<SprintTasksInfoDto[]> {
    return this.http.get<SprintTasksInfoDto[]>(`${this.baseUrl}/board/${boardId}`);
  }

  public startSprint(id: string): Observable<null> {
    return this.http.put<null>(`${this.baseUrl}/start/${id}`, {});
  }

  public findAllByBoardDropdown(boardId: string): Observable<SprintDto[]> {
    return this.http.get<SprintDto[]>(`${this.baseUrl}/board/${boardId}/dropdown`);
  }

  public findByIdAllTasks(id: string): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(`${this.baseUrl}/${id}/tasks`);
  }

  public completedSprint(id: string): Observable<null> {
    return this.http.put<null>(`${this.baseUrl}/completed/${id}`, {});
  }
}
