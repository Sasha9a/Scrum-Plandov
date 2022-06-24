import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { SprintTasksInfoDto } from "@scrum/shared/dtos/sprint/sprint.tasks.info.dto";
import { ErrorService } from "@scrum/web/core/services/error.service";
import { SprintService } from "@scrum/web/core/services/sprint/sprint.service";
import { SprintWorkUsersInfoComponent } from "@scrum/web/modules/sprint/dumbs/sprint-work-users-info/sprint-work-users-info.component";
import { TaskAddComponent } from "@scrum/web/modules/task/components/add/task-add.component";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
  selector: 'grace-board-sprint',
  templateUrl: './board-sprint.component.html',
  styleUrls: ['./board-sprint.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardSprintComponent implements OnInit, OnDestroy {

  @Input() public board: BoardDto;
  public loading = true;

  public sprints: SprintTasksInfoDto[];

  public ref: DynamicDialogRef;

  public constructor(private readonly sprintService: SprintService,
                     private readonly cdRef: ChangeDetectorRef,
                     private readonly dialogService: DialogService,
                     private readonly errorService: ErrorService) {}

  public ngOnInit(): void {
    this.sprintService.findAllByBoard(this.board?._id).subscribe((sprints) => {
      this.sprints = sprints;
      this.loading = false;
      this.cdRef.markForCheck();
    });
  }

  public ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }

  public openSprintUsersInfo(sprint: SprintTasksInfoDto) {
    this.ref = this.dialogService.open(SprintWorkUsersInfoComponent, {
      header: `Рабочая нагрузка по исполнителям - ${sprint.sprint?.name}`,
      contentStyle: { 'max-width': '700px', 'overflow': 'auto', 'max-height': '500px' },
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
  }

}
