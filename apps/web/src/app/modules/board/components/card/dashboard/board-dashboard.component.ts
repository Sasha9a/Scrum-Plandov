import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from "@angular/router";
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { BoardService } from "@scrum/web/core/services/board/board.service";
import { ConfirmDialogService } from "@scrum/web/core/services/confirm-dialog.service";
import { ErrorService } from "@scrum/web/core/services/error.service";
import { AuthService } from "@scrum/web/core/services/user/auth.service";
import { SprintDto } from "@scrum/shared/dtos/sprint/sprint.dto";
import { SprintService } from "@scrum/web/core/services/sprint/sprint.service";
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";
import { TaskFilterPipe } from "@scrum/web/shared/pipes/task-filter/task-filter.pipe";
import moment from "moment-timezone";

@Component({
  selector: 'grace-board-dashboard',
  templateUrl: './board-dashboard.component.html',
  styleUrls: ['./board-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardDashboardComponent implements OnInit {

  @Input() public board: BoardDto;
  public loading = false;

  public userSelect: UserDto;
  public loadingLeave = false;

  public activeSprint: SprintDto;
  public tasks: TaskDto[];

  public endDate: number;

  public filterItems: { name: string, value: string }[] = [];
  public selectedFilterItems: string[] = [];

  public columnsInfo: Record<string, string> = {};

  public activeTask: TaskDto;

  public constructor(public readonly authService: AuthService,
                     private readonly boardService: BoardService,
                     private readonly sprintService: SprintService,
                     private readonly confirmService: ConfirmDialogService,
                     private readonly cdRef: ChangeDetectorRef,
                     private readonly errorService: ErrorService,
                     private readonly router: Router,
                     private readonly taskFilterPipe: TaskFilterPipe) {}

  public ngOnInit(): void {
    if (this.board?.activeSprints?.length) {
      this.loadSprint(this.board?.activeSprints[0]);
    } else {
      this.updateInfoColumns();
    }

    this.filterItems = [this.board.createdUser, ...this.board.users].map((user) => {
      return {
        name: user?.name || user?.login,
        value: user?._id
      };
    });
  }

  public loadSprint(sprint: SprintDto) {
    this.loading = true;
    this.cdRef.markForCheck();

    if (this.activeSprint !== sprint) {
      this.activeSprint = sprint;
    }
    this.sprintService.findByIdAllTasks(this.activeSprint?._id).subscribe((tasks) => {
      this.tasks = tasks;
      this.endDate = moment(this.activeSprint.endDate).diff(moment().subtract(1, 'day'), 'days');
      this.updateInfoColumns();
      this.loading = false;
      this.cdRef.markForCheck();
    });
  }

  public leaveBoard() {
    this.loadingLeave = true;
    this.cdRef.markForCheck();

    this.boardService.leave(this.board._id, { user: this.userSelect }).subscribe({
      next: () => {
        this.loadingLeave = false;
        this.cdRef.markForCheck();
        this.errorService.addSuccessMessage(`Вы успешно покинули доску "${this.board?.name}"`);
        this.router.navigate(['/board']).catch(console.error);
      },
      error: () => {
        this.loadingLeave = false;
        this.cdRef.markForCheck();
      }
    });
  }

  public compiledSprint() {
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

}
