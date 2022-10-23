import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardDto } from '@scrum/shared/dtos/board/board.dto';
import { ColumnBoardDto } from '@scrum/shared/dtos/board/column.board.dto';
import { SprintDto } from '@scrum/shared/dtos/sprint/sprint.dto';
import { TaskDto } from '@scrum/shared/dtos/task/task.dto';
import { BoardService } from '@scrum/web/core/services/board/board.service';
import { WebsocketBoardService } from '@scrum/web/core/services/board/websocket-board.service';
import { ConfirmDialogService } from '@scrum/web/core/services/confirm-dialog.service';
import { ErrorService } from '@scrum/web/core/services/error.service';
import { SprintService } from '@scrum/web/core/services/sprint/sprint.service';
import { WebsocketSprintService } from '@scrum/web/core/services/sprint/websocket-sprint.service';
import { TaskService } from '@scrum/web/core/services/task/task.service';
import { WebsocketTaskService } from '@scrum/web/core/services/task/websocket-task.service';
import { TitleService } from '@scrum/web/core/services/title.service';
import { AuthService } from '@scrum/web/core/services/user/auth.service';
import { BoardLeaveDialogComponent } from '@scrum/web/modules/board/dumbs/board-leave-dialog/board-leave-dialog.component';
import { TaskAddComponent } from '@scrum/web/modules/task/components/task/add/task-add.component';
import { TaskFilterPipe } from '@scrum/web/shared/pipes/task-filter/task-filter.pipe';
import moment from 'moment-timezone';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'grace-board-dashboard',
  templateUrl: './board-dashboard.component.html',
  styleUrls: ['./board-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardDashboardComponent implements OnInit, OnDestroy {
  public boardId: string;
  public board: BoardDto;
  public loading = false;

  public activeSprint: SprintDto;
  public tasks: TaskDto[];

  public endDate: number;

  public filterItems: { name: string; value: string }[] = [];
  public selectedFilterItems: string[] = [];

  public columnsInfo: Record<string, string> = {};

  public buttonItems: MenuItem[];

  public activeTask: TaskDto;
  public draggedTask: TaskDto;

  public ref: DynamicDialogRef;

  private onUpdateBoard$: Subscription;

  private onUpdateSprint$: Subscription;
  private onDeleteSprint$: Subscription;

  private onCreateTask$: Subscription;
  private onUpdateTask$: Subscription;
  private onDeleteTask$: Subscription;

  public constructor(
    public readonly authService: AuthService,
    private readonly websocketBoardService: WebsocketBoardService,
    private readonly websocketSprintService: WebsocketSprintService,
    private readonly websocketTaskService: WebsocketTaskService,
    private readonly boardService: BoardService,
    private readonly taskService: TaskService,
    private readonly sprintService: SprintService,
    private readonly confirmService: ConfirmDialogService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly errorService: ErrorService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly taskFilterPipe: TaskFilterPipe,
    private readonly dialogService: DialogService,
    private readonly titleService: TitleService
  ) {}

  public ngOnInit(): void {
    this.boardId = this.route.snapshot.params.id;

    if (!this.boardId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.initSubscribes();

    const filters = localStorage.getItem(`board.filters.${this.boardId}`);
    if (filters) {
      this.selectedFilterItems = JSON.parse(filters);
    }

    this.loadBoard();
  }

  public ngOnDestroy() {
    this.onUpdateBoard$?.unsubscribe();
    this.onUpdateSprint$?.unsubscribe();
    this.onDeleteSprint$?.unsubscribe();
    this.onCreateTask$?.unsubscribe();
    this.onUpdateTask$?.unsubscribe();
    this.onDeleteTask$?.unsubscribe();
  }

  public initSubscribes() {
    this.onUpdateBoard$ = this.websocketBoardService.onUpdateBoard$.subscribe(() => {
      this.loadBoard(false);
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
      this.filterItems = [this.board.createdUser, ...this.board.users].map((user) => {
        return {
          name: user?.name || user?.login,
          value: user?._id
        };
      });

      this.activeSprint = null;
      this.tasks = [];

      if (withLoading) {
        this.loading = false;
      }
      this.cdRef.markForCheck();
      this.load(withLoading);
    });
  }

  public load(withLoading = true) {
    if (this.board?.activeSprints?.length) {
      this.loadSprint(this.board?.activeSprints[0], withLoading);
    } else {
      this.updateInfoColumns();
    }

    this.buttonItems = [
      {
        label: 'Завершить спринт',
        icon: 'pi pi-check',
        visible: !!this.activeSprint,
        iconStyle: { color: 'green' },
        command: () => {
          this.compiledSprint();
        }
      },
      {
        label: 'Редактировать',
        icon: 'pi pi-pencil',
        visible: this.authService.currentUser?._id === this.board?.createdUser?._id,
        routerLink: `/board/edit/${this.boardId}`
      },
      {
        separator: true,
        visible: this.authService.currentUser?._id === this.board?.createdUser?._id || !!this.activeSprint
      },
      {
        label: 'Покинуть',
        icon: 'pi pi-times',
        iconStyle: { color: 'red' },
        command: () => {
          this.showDialogLeave();
        }
      }
    ];
  }

  public loadSprint(sprint: SprintDto, withLoading = true) {
    if (withLoading) {
      this.loading = true;
      this.cdRef.markForCheck();
    }

    if (this.activeSprint !== sprint) {
      this.activeSprint = sprint;
    }
    this.sprintService.findByIdAllTasks(this.activeSprint?._id).subscribe((tasks) => {
      this.tasks = tasks;
      this.endDate = moment(this.activeSprint.endDate).diff(moment().subtract(1, 'day'), 'days');
      this.updateInfoColumns();
      if (withLoading) {
        this.loading = false;
      }
      this.cdRef.markForCheck();
    });
  }

  public compiledSprint() {
    this.confirmService.confirm({
      message: `Вы действительно хотите завершить спринт "${this.activeSprint?.name}"?`,
      accept: () => {
        this.loading = true;
        this.cdRef.markForCheck();

        this.websocketBoardService.completedSprint({ sprintId: this.activeSprint?._id, boardId: this.boardId }).subscribe({
          next: () => {
            this.loading = false;
            this.board.activeSprints = this.board.activeSprints.filter((sprint) => sprint._id !== this.activeSprint?._id);
            this.errorService.addSuccessMessage(`Вы успешно завершили спринт "${this.activeSprint?.name}"`);
            if (this.board.activeSprints?.length) {
              this.loadSprint(this.board?.activeSprints[0]);
            } else {
              this.activeSprint = null;
              this.tasks = null;
              this.updateInfoColumns();
            }
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

  public changeSprint() {
    this.loadSprint(this.activeSprint);
  }

  public updateInfoColumns() {
    this.board.columns?.forEach((column) => {
      const tasks = this.tasks?.filter((task) => task.status?._id === column._id);
      const countTaskAll = tasks?.length || 0;
      const countTasksWithFilters = this.taskFilterPipe.transform(tasks, this.selectedFilterItems)?.length;
      this.columnsInfo[column._id] = `${
        countTasksWithFilters !== countTaskAll ? countTasksWithFilters + ' из ' + countTaskAll : countTaskAll
      }`;
    });
  }

  public dragStartTask(task: TaskDto) {
    this.draggedTask = task;
  }

  public dragEndTask() {
    this.draggedTask = null;
  }

  public dropTask(column: ColumnBoardDto) {
    this.websocketTaskService
      .updateTask({ taskId: this.draggedTask?._id, boardId: this.boardId, body: { ...this.draggedTask, status: column } })
      .subscribe({
        next: (task) => {
          this.tasks = this.tasks.filter((_task) => _task?._id !== task?._id);
          this.tasks.push(task);
          this.draggedTask = null;
          this.updateInfoColumns();
          this.cdRef.markForCheck();
        },
        error: () => (this.draggedTask = null)
      });
  }

  public createTask() {
    this.ref = this.dialogService.open(TaskAddComponent, {
      header: `Создать задачу`,
      contentStyle: { overflow: 'auto' },
      styleClass: 'xl:w-4 lg:w-6 md:w-8 sm:w-10 w-full',
      baseZIndex: 99999,
      data: {
        board: this.board,
        sprint: this.activeSprint
      }
    });
  }

  public selectedFilters() {
    localStorage.setItem(`board.filters.${this.board?._id}`, JSON.stringify(this.selectedFilterItems));
    this.updateInfoColumns();
  }

  public showDialogLeave() {
    this.ref = this.dialogService.open(BoardLeaveDialogComponent, {
      header: `Исключение`,
      contentStyle: { overflow: 'auto' },
      styleClass: 'xl:w-4 lg:w-6 md:w-8 sm:w-10 w-full',
      baseZIndex: 99999,
      data: {
        board: this.board
      }
    });
  }
}
