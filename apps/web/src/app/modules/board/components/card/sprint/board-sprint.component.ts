import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { SprintTasksInfoDto } from "@scrum/shared/dtos/sprint/sprint.tasks.info.dto";
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";
import { BoardService } from "@scrum/web/core/services/board/board.service";
import { ErrorService } from "@scrum/web/core/services/error.service";
import { SprintService } from "@scrum/web/core/services/sprint/sprint.service";
import { TitleService } from "@scrum/web/core/services/title.service";
import { SprintWorkUsersInfoComponent } from "@scrum/web/modules/sprint/dumbs/sprint-work-users-info/sprint-work-users-info.component";
import { TaskAddComponent } from "@scrum/web/modules/task/components/task/add/task-add.component";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
  selector: 'grace-board-sprint',
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

  public constructor(private readonly sprintService: SprintService,
                     private readonly boardService: BoardService,
                     private readonly cdRef: ChangeDetectorRef,
                     private readonly dialogService: DialogService,
                     private readonly route: ActivatedRoute,
                     private readonly errorService: ErrorService,
                     private readonly titleService: TitleService) {}

  public ngOnInit(): void {
    this.boardId = this.route.snapshot.params.id;

    if (!this.boardId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.loadBoard();
  }

  public ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }

  public loadBoard() {
    this.loading = true;
    this.cdRef.markForCheck();

    this.boardService.findById<BoardDto>(this.boardId).subscribe((board) => {
      this.board = board;
      this.titleService.setTitle(`${this.board?.name}`);
      this.loading = false;
      this.cdRef.markForCheck();
      this.load();
    });
  }

  public load() {
    this.loading = true;
    this.cdRef.markForCheck();

    this.sprintService.findAllByBoard(this.board?._id).subscribe((sprints) => {
      this.sprints = sprints;
      this.loading = false;
      this.cdRef.markForCheck();
    });
  }

  public openSprintUsersInfo(sprint: SprintTasksInfoDto) {
    this.ref = this.dialogService.open(SprintWorkUsersInfoComponent, {
      header: `Рабочая нагрузка по исполнителям - ${sprint.sprint?.name}`,
      contentStyle: { 'max-width': '750px', 'overflow': 'auto', 'max-height': '500px' },
      baseZIndex: 99999,
      data: {
        sprint: sprint
      }
    });
  }

  public startSprint(sprint: SprintTasksInfoDto) {
    this.loading = true;
    this.cdRef.markForCheck();

    this.sprintService.startSprint(sprint.sprint?._id).subscribe({
      next: () => {
        this.loading = false;
        this.board.activeSprints.push(sprint.sprint);
        this.errorService.addSuccessMessage('Спринт запущен');
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
        board: this.board
      }
    });

    this.ref.onClose.subscribe(() => {
      this.load();
    });
  }

}
