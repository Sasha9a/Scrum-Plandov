import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardDto } from '@scrum/shared/dtos/board/board.dto';
import { SprintTasksInfoDto } from '@scrum/shared/dtos/sprint/sprint.tasks.info.dto';
import { TaskDto } from '@scrum/shared/dtos/task/task.dto';
import { BoardService } from '@scrum/web/core/services/board/board.service';
import { WebsocketBoardService } from '@scrum/web/core/services/board/websocket-board.service';
import { ConfirmDialogService } from '@scrum/web/core/services/confirm-dialog.service';
import { ErrorService } from '@scrum/web/core/services/error.service';
import { SprintService } from '@scrum/web/core/services/sprint/sprint.service';
import { WebsocketSprintService } from '@scrum/web/core/services/sprint/websocket-sprint.service';
import { WebsocketTaskService } from '@scrum/web/core/services/task/websocket-task.service';
import { TitleService } from '@scrum/web/core/services/title.service';
import { AuthService } from '@scrum/web/core/services/user/auth.service';
import { SprintWorkUsersInfoComponent } from '@scrum/web/modules/sprint/dumbs/sprint-work-users-info/sprint-work-users-info.component';
import { TaskAddComponent } from '@scrum/web/modules/task/components/task/add/task-add.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'scrum-board-sprint',
  templateUrl: './board-sprint.component.html',
  styleUrls: ['./board-sprint.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardSprintComponent implements OnInit, OnDestroy {
  public boardId: string;
  public board: BoardDto;
  public loading = false;

  public sprints: SprintTasksInfoDto[];

  public ref: DynamicDialogRef;

  public activeTask: TaskDto;

  private onUpdateBoard$: Subscription;

  private onCreateSprint$: Subscription;
  private onUpdateSprint$: Subscription;
  private onDeleteSprint$: Subscription;

  private onCreateTask$: Subscription;
  private onUpdateTask$: Subscription;
  private onDeleteTask$: Subscription;

  public constructor(
    private readonly sprintService: SprintService,
    private readonly authService: AuthService,
    private readonly websocketBoardService: WebsocketBoardService,
    private readonly websocketSprintService: WebsocketSprintService,
    private readonly websocketTaskService: WebsocketTaskService,
    private readonly boardService: BoardService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly dialogService: DialogService,
    private readonly route: ActivatedRoute,
    private readonly errorService: ErrorService,
    private readonly titleService: TitleService,
    private readonly confirmService: ConfirmDialogService
  ) {}

  public ngOnInit(): void {
    this.boardId = this.route.snapshot.params.id;

    if (!this.boardId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.initSubscribes();
    this.loadBoard();
  }

  public ngOnDestroy() {
    this.onUpdateBoard$?.unsubscribe();
    this.onCreateSprint$?.unsubscribe();
    this.onUpdateSprint$?.unsubscribe();
    this.onDeleteSprint$?.unsubscribe();
    this.onCreateTask$?.unsubscribe();
    this.onUpdateTask$?.unsubscribe();
    this.onDeleteTask$?.unsubscribe();
    this.ref?.close();
  }

  public initSubscribes() {
    this.onUpdateBoard$ = this.websocketBoardService.onUpdateBoard$.subscribe(() => {
      this.loadBoard(false);
    });

    this.onCreateSprint$ = this.websocketSprintService.onCreateSprint$.subscribe(() => {
      this.load(false);
    });
    this.onUpdateSprint$ = this.websocketSprintService.onUpdateSprint$.subscribe(() => {
      this.load(false);
    });
    this.onDeleteSprint$ = this.websocketSprintService.onDeleteSprint$.subscribe(() => {
      this.loadBoard(false);
    });

    this.onCreateTask$ = this.websocketTaskService.onCreateTask$.subscribe(() => {
      this.load(false);
    });
    this.onUpdateTask$ = this.websocketTaskService.onUpdateTask$.subscribe(() => {
      this.load(false);
    });
    this.onDeleteTask$ = this.websocketTaskService.onDeleteTask$.subscribe(() => {
      this.load(false);
    });
  }

  public loadBoard(withLoading = true) {
    if (withLoading) {
      this.loading = true;
      this.cdRef.markForCheck();
    }

    this.boardService.findById<BoardDto>(this.boardId).subscribe((board) => {
      this.board = board;
      this.titleService.setTitle(`${this.board?.name}`);
      if (withLoading) {
        this.loading = false;
      }
      this.cdRef.markForCheck();
      this.load(withLoading);
    });
  }

  public load(withLoading = true) {
    if (withLoading) {
      this.loading = true;
      this.cdRef.markForCheck();
    }

    this.sprintService.findAllByBoard(this.boardId).subscribe((sprints) => {
      this.sprints = sprints;
      if (withLoading) {
        this.loading = false;
      }
      this.cdRef.markForCheck();
    });
  }

  public openSprintUsersInfo(sprint: SprintTasksInfoDto) {
    this.ref = this.dialogService.open(SprintWorkUsersInfoComponent, {
      header: `Рабочая нагрузка по исполнителям - ${sprint.sprint?.name}`,
      contentStyle: { 'max-width': '750px', overflow: 'auto', 'max-height': '500px' },
      baseZIndex: 99999,
      data: {
        sprint: sprint
      }
    });
  }

  public startSprint(sprint: SprintTasksInfoDto) {
    this.confirmService.confirm({
      message: `Вы действительно хотите запустить спринт "${sprint?.sprint?.name}"?`,
      accept: () => {
        this.loading = true;
        this.cdRef.markForCheck();

        this.websocketBoardService.startSprint({ sprintId: sprint.sprint?._id, boardId: this.boardId }).subscribe({
          next: () => {
            this.board.activeSprints.push(sprint.sprint);
            this.errorService.addSuccessMessage('Спринт запущен');
            this.loading = false;
            this.cdRef.markForCheck();
          },
          error: () => {
            this.loading = false;
            this.cdRef.markForCheck();
          }
        });
      }
    });
  }

  public createTask() {
    this.ref = this.dialogService.open(TaskAddComponent, {
      header: `Создать задачу`,
      contentStyle: { overflow: 'auto' },
      styleClass: 'xl:w-4 lg:w-6 md:w-8 sm:w-10 w-full',
      baseZIndex: 99999,
      data: {
        board: this.board
      }
    });
  }
}
