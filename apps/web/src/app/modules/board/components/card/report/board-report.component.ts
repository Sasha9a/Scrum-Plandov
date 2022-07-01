import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { ReportBoardQueryParamsDto } from "@scrum/shared/dtos/report/report.board.query.params.dto";
import { ReportBoardSpentItemDto } from "@scrum/shared/dtos/report/report.board.spent.item.dto";
import { SprintDto } from "@scrum/shared/dtos/sprint/sprint.dto";
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { BoardService } from "@scrum/web/core/services/board/board.service";
import { FiltersService } from "@scrum/web/core/services/filters.service";
import { QueryParamsService } from "@scrum/web/core/services/query-params.service";
import { ReportService } from "@scrum/web/core/services/report/report.service";
import { SprintService } from "@scrum/web/core/services/sprint/sprint.service";
import { TaskService } from "@scrum/web/core/services/task/task.service";
import { KeysOfType } from "@scrum/web/core/types/keys-of.type";
import moment from "moment-timezone";
import { forkJoin } from "rxjs";

@Component({
  selector: 'grace-board-report',
  templateUrl: './board-report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardReportComponent implements OnInit {

  @Input() public board: BoardDto;
  public loading = false;

  public storageName = 'report.spent';

  public queryParams: ReportBoardQueryParamsDto;

  public filters: { users: UserDto[], sprints: SprintDto[], tasks: TaskDto[] } = {
    users: [],
    sprints: [],
    tasks: []
  };

  public selectedFilters: { users: UserDto[], sprints: SprintDto[], tasks: TaskDto[] } = {
    users: [],
    sprints: [],
    tasks: []
  };

  public constructor(private readonly reportService: ReportService,
                     private readonly boardService: BoardService,
                     private readonly sprintService: SprintService,
                     private readonly taskService: TaskService,
                     private readonly queryParamsService: QueryParamsService,
                     private readonly filtersService: FiltersService,
                     private readonly cdRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.queryParams = this.queryParamsService.getFilteredQueryParams(ReportBoardQueryParamsDto, <ReportBoardQueryParamsDto>{
      from: (localStorage.getItem(`${this.storageName}.from`) || moment().startOf('month').format('YYYY-MM-DD')) as unknown as Date,
      to: (localStorage.getItem(`${this.storageName}.to`) || moment().endOf('month').format('YYYY-MM-DD')) as unknown as Date,
      board: this.board?._id
    });

    forkJoin([
      this.boardService.findAllUsersByBoard(this.board?._id),
      this.sprintService.findAllByBoardDropdown(this.board?._id),
      this.taskService.findAllByBoard(this.board?._id)
    ]).subscribe(([users, sprints, tasks]) => {
      this.filters = {
        users: users,
        sprints: sprints,
        tasks: tasks
      };
      this.loadReport();
    });
  }

  public loadReport() {
    this.loading = true;
    this.cdRef.markForCheck();

    this.queryParamsService.setQueryParams(this.queryParams);
    this.reportService.spent(this.queryParams).subscribe((res) => {
      this.selectedFilters = this.queryParamsService.getFilteredEntities(this.filters, this.queryParams);
      this.loading = false;
      this.cdRef.markForCheck();
    });
  }

  public setDateFilters(dates: [Date, Date]) {
    [this.queryParams.from, this.queryParams.to] = this.filtersService.formatISOPeriod(dates, this.storageName);
    this.loadReport();
  }

  public setEntityFilters(filter: KeysOfType<ReportBoardQueryParamsDto, string[]>, values: { _id: string }[]) {
    this.queryParams[filter] = values.map(item => item._id);
  }

  public toSpentInfo(spent: any): ReportBoardSpentItemDto {
    return spent as ReportBoardSpentItemDto;
  }

}
