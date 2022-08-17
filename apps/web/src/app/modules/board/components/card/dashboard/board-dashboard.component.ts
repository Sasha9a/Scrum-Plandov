import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { BoardService } from "@scrum/web/core/services/board/board.service";
import { WebsocketBoardService } from "@scrum/web/core/services/board/websocket-board.service";
import { ConfirmDialogService } from "@scrum/web/core/services/confirm-dialog.service";
import { ErrorService } from "@scrum/web/core/services/error.service";
import { WebsocketDashboardSprintService } from "@scrum/web/core/services/sprint/websocket-dashboard-sprint.service";
import { TitleService } from "@scrum/web/core/services/title.service";
import { AuthService } from "@scrum/web/core/services/user/auth.service";
import { SprintDto } from "@scrum/shared/dtos/sprint/sprint.dto";
import { SprintService } from "@scrum/web/core/services/sprint/sprint.service";
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";
import { BoardLeaveDialogComponent } from "@scrum/web/modules/board/dumbs/board-leave-dialog/board-leave-dialog.component";
import { TaskFilterPipe } from "@scrum/web/shared/pipes/task-filter/task-filter.pipe";
import moment from "moment-timezone";
import { TaskService } from "@scrum/web/core/services/task/task.service";
import { ColumnBoardDto } from "@scrum/shared/dtos/board/column.board.dto";
import { TaskAddComponent } from "@scrum/web/modules/task/components/task/add/task-add.component";
import { MenuItem } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { Subscription } from "rxjs";

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

  public filterItems: { name: string, value: string }[] = [];
  public selectedFilterItems: string[] = [];

  public columnsInfo: Record<string, string> = {};

  public buttonItems: MenuItem[];

  public activeTask: TaskDto;
  public draggedTask: TaskDto;

  public ref: DynamicDialogRef;

  private updateBoardSubscription$: Subscription;
  private updateSprintSubscription$: Subscription;

  public constructor(public readonly authService: AuthService,
                     private readonly websocketBoardService: WebsocketBoardService,
                     private readonly websocketDashboardSprintService: WebsocketDashboardSprintService,
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
                     private readonly titleService: TitleService) {}

  public ngOnInit(): void {
    this.boardId = this.route.snapshot.params.id;

    if (!this.boardId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.websocketBoardService.createWSConnection(this.authService.getToken(), this.boardId);

    this.updateBoardSubscription$ = this.websocketBoardService.updatedBoardInfo$.subscribe(() => {
      this.loadBoard();
    });

    const filters = localStorage.getItem(`board.filters.${this.boardId}`);
    if (filters) {
      this.selectedFilterItems = JSON.parse(filters);
    }

    this.loadBoard();
  }

  public ngOnDestroy() {
    this.updateBoardSubscription$?.unsubscribe();
    this.websocketBoardService.socket?.disconnect();
    this.updateSprintSubscription$?.unsubscribe();
    this.websocketDashboardSprintService.socket?.disconnect();
  }

  public loadBoard() {
    this.loading = true;
    this.cdRef.markForCheck();

    this.websocketBoardService.getBoard({ boardId: this.boardId }).subscribe((board) => {
      this.board = board;
      this.titleService.setTitle(`${this.board?.name}`);
      this.filterItems = [this.board.createdUser, ...this.board.users].map((user) => {
        return {
          name: user?.name || user?.login,
          value: user?._id
        };
      });

      this.loading = false;
      this.cdRef.markForCheck();
      this.load();
    });
  }

  public load() {
    if (this.board?.activeSprints?.length) {
      this.loadSprint(this.board?.activeSprints[0]);
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

  public loadSprint(sprint: SprintDto) {
    this.loading = true;
    this.cdRef.markForCheck();

    if (this.activeSprint !== sprint) {
      this.updateSprintSubscription$?.unsubscribe();
      this.websocketDashboardSprintService.socket?.disconnect();
      this.activeSprint = sprint;
      this.websocketDashboardSprintService.createWSConnection(this.authService.getToken(), this.activeSprint?._id);
      this.updateSprintSubscription$ = this.websocketDashboardSprintService.updatedSprintDashboardInfo$.subscribe(() => {
        this.loadBoard();
      });
    }
    this.websocketDashboardSprintService.findByIdAllTasks({ sprintId: this.activeSprint?._id }).subscribe((tasks) => {
      this.tasks = tasks;
      this.endDate = moment(this.activeSprint.endDate).diff(moment().subtract(1, 'day'), 'days');
      this.updateInfoColumns();
      this.loading = false;
      this.cdRef.markForCheck();
    });
  }

  public compiledSprint() {
    this.confirmService.confirm({
      message: `Вы действительно хотите завершить спринт "${this.activeSprint?.name}"?`,
      accept: () => {
        this.loading = true;
        this.cdRef.markForCheck();

        this.sprintService.completedSprint(this.activeSprint?._id).subscribe({
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
      this.columnsInfo[column._id] = `${countTasksWithFilters !== countTaskAll ? (countTasksWithFilters + ' из ' + countTaskAll) : countTaskAll}`;
    });
  }

  public dragStartTask(task: TaskDto) {
    this.draggedTask = task;
  }

  public dragEndTask() {
    this.draggedTask = null;
  }

  public dropTask(column: ColumnBoardDto) {
    this.loading = true;
    this.cdRef.markForCheck();

    this.taskService.update<Partial<TaskDto>, TaskDto>(this.draggedTask?._id, { ...this.draggedTask, status: column }).subscribe({
      next: (task) => {
        this.tasks = this.tasks.filter((_task) => _task?._id !== this.draggedTask?._id);
        this.tasks.push({ ...task });
        this.draggedTask = null;
        this.updateInfoColumns();
        this.loading = false;
        this.cdRef.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdRef.markForCheck();
      }
    });
  }

  public createTask() {
    this.ref = this.dialogService.open(TaskAddComponent, {
      header: `Создать задачу`,
      contentStyle: { 'overflow': 'auto' },
      styleClass: 'xl:w-4 lg:w-6 md:w-8 sm:w-10 w-full',
      baseZIndex: 99999,
      data: {
        board: this.board,
        sprint: this.activeSprint
      }
    });

    this.ref.onClose.subscribe((task) => {
      if (task) {
        this.load();
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
      contentStyle: { 'overflow': 'auto' },
      styleClass: 'xl:w-4 lg:w-6 md:w-8 sm:w-10 w-full',
      baseZIndex: 99999,
      data: {
        board: this.board
      }
    });
  }

}
