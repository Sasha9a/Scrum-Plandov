import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BoardDto } from '@scrum/shared/dtos/board/board.dto';
import { SprintDto } from '@scrum/shared/dtos/sprint/sprint.dto';
import { TaskFormDto } from '@scrum/shared/dtos/task/task.form.dto';
import { UserDto } from '@scrum/shared/dtos/user/user.dto';
import { BoardService } from '@scrum/web/core/services/board/board.service';
import { ErrorService } from '@scrum/web/core/services/error.service';
import { SprintService } from '@scrum/web/core/services/sprint/sprint.service';
import { TaskService } from '@scrum/web/core/services/task/task.service';
import { WebsocketTaskService } from '@scrum/web/core/services/task/websocket-task.service';
import { AuthService } from '@scrum/web/core/services/user/auth.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'scrum-task-add',
  templateUrl: './task-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskAddComponent implements OnInit, OnDestroy {
  public board: BoardDto;
  public sprint: SprintDto;
  public saving = false;

  public users: UserDto[];
  public sprints: SprintDto[];

  public constructor(
    private readonly config: DynamicDialogConfig,
    private readonly sprintService: SprintService,
    private readonly websocketTaskService: WebsocketTaskService,
    private readonly authService: AuthService,
    private readonly taskService: TaskService,
    private readonly boardService: BoardService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly errorService: ErrorService,
    private readonly ref: DynamicDialogRef
  ) {
    this.board = config.data.board;
    this.sprint = config.data.sprint;
  }

  public ngOnInit(): void {
    this.websocketTaskService.createWSConnection(this.authService.getToken(), this.board?._id);

    forkJoin([
      this.boardService.findAllUsersByBoard(this.board?._id),
      this.sprintService.findAllByBoardDropdown(this.board?._id)
    ]).subscribe(([users, sprints]) => {
      this.users = users;
      this.sprints = sprints;
      this.cdRef.markForCheck();
    });
  }

  public ngOnDestroy() {
    this.websocketTaskService.socket?.disconnect();
  }

  public create(body: TaskFormDto) {
    this.saving = true;
    this.cdRef.markForCheck();

    this.websocketTaskService.createTask({ boardId: this.board?._id, body }).subscribe({
      next: (task) => {
        this.saving = false;
        this.cdRef.markForCheck();
        this.errorService.addSuccessMessage('Задача создана');
        this.ref.close(task);
      },
      error: () => {
        this.saving = false;
        this.cdRef.markForCheck();
      }
    });
  }
}
