import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SprintDto } from '@scrum/shared/dtos/sprint/sprint.dto';
import { TaskDto } from '@scrum/shared/dtos/task/task.dto';
import { TaskFormDto } from '@scrum/shared/dtos/task/task.form.dto';
import { UserDto } from '@scrum/shared/dtos/user/user.dto';
import { BoardService } from '@scrum/web/core/services/board/board.service';
import { ConfirmDialogService } from '@scrum/web/core/services/confirm-dialog.service';
import { ErrorService } from '@scrum/web/core/services/error.service';
import { SprintService } from '@scrum/web/core/services/sprint/sprint.service';
import { TaskService } from '@scrum/web/core/services/task/task.service';
import { WebsocketTaskService } from '@scrum/web/core/services/task/websocket-task.service';
import { AuthService } from '@scrum/web/core/services/user/auth.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'scrum-task-edit',
  templateUrl: './task-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskEditComponent implements OnInit, OnDestroy {
  public taskId: string;
  public task: TaskDto;
  public loading = true;

  public users: UserDto[];
  public sprints: SprintDto[];

  public constructor(
    private readonly config: DynamicDialogConfig,
    private readonly taskService: TaskService,
    private readonly sprintService: SprintService,
    private readonly websocketTaskService: WebsocketTaskService,
    private readonly authService: AuthService,
    private readonly boardService: BoardService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly errorService: ErrorService,
    private readonly ref: DynamicDialogRef,
    private readonly confirmService: ConfirmDialogService
  ) {
    this.taskId = config.data.taskId;
  }

  public ngOnInit(): void {
    this.taskService.findById<TaskDto>(this.taskId).subscribe((task) => {
      this.task = task;
      this.websocketTaskService.createWSConnection(this.authService.getToken(), this.task?.board?._id);
      forkJoin([
        this.boardService.findAllUsersByBoard(this.task?.board?._id),
        this.sprintService.findAllByBoardDropdown(this.task?.board?._id)
      ]).subscribe(([users, sprints]) => {
        this.users = users;
        this.sprints = sprints;
        this.cdRef.markForCheck();
      });
      this.loading = false;
      this.cdRef.markForCheck();
    });
  }

  public ngOnDestroy() {
    this.websocketTaskService.socket?.disconnect();
  }

  public edit(body: TaskFormDto) {
    this.loading = true;
    this.cdRef.markForCheck();

    this.websocketTaskService.updateTask({ taskId: this.taskId, boardId: this.task?.board?._id, body }).subscribe({
      next: (task) => {
        this.loading = false;
        this.cdRef.markForCheck();
        this.errorService.addSuccessMessage(`Задача "${this.task?.board?.code}-${this.task?.number}" обновлена`);
        this.ref.close({ task: task, isDeleted: false });
      },
      error: () => {
        this.loading = false;
        this.cdRef.markForCheck();
      }
    });
  }

  public delete() {
    this.confirmService.confirm({
      message: `Вы действительно хотите удалить задачу "${this.task?.board?.code}-${this.task?.number}"?`,
      accept: () => {
        this.loading = true;
        this.cdRef.markForCheck();

        this.websocketTaskService.deleteTask({ taskId: this.task?._id, boardId: this.task?.board?._id }).subscribe(() => {
          this.loading = false;
          this.cdRef.markForCheck();
          this.errorService.addSuccessMessage(`Задача "${this.task?.board?.code}-${this.task?.number}" удалена`);
          this.ref.close({ task: this.task, isDeleted: true });
        });
      }
    });
  }
}
