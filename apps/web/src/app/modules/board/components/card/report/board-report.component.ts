import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { ReportBoardQueryParamsDto } from "@scrum/shared/dtos/report/report.board.query.params.dto";
import { ReportBoardSpentDto } from "@scrum/shared/dtos/report/report.board.spent.dto";
import { ReportBoardSpentItemDto } from "@scrum/shared/dtos/report/report.board.spent.item.dto";
import { SprintDto } from "@scrum/shared/dtos/sprint/sprint.dto";
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { CrmTableColumn } from "@scrum/web/core/models/crm-table-column";
import { BoardService } from "@scrum/web/core/services/board/board.service";
import { FiltersService } from "@scrum/web/core/services/filters.service";
import { QueryParamsService } from "@scrum/web/core/services/query-params.service";
import { ReportService } from "@scrum/web/core/services/report/report.service";
import { SprintService } from "@scrum/web/core/services/sprint/sprint.service";
import { TaskService } from "@scrum/web/core/services/task/task.service";
import { KeysOfType } from "@scrum/web/core/types/keys-of.type";
import moment from "moment-timezone";
import { forkJoin } from "rxjs";
import { UIChart } from "primeng/chart";

@Component({
  selector: 'grace-board-report',
  templateUrl: './board-report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardReportComponent implements OnInit {

  @Input() public board: BoardDto;
  public loading = false;

  public storageName = 'report.spent';
  public data: ReportBoardSpentDto;

  public columns: CrmTableColumn[] = [
    { label: 'Дата', name: 'date', sort: 'date:date' },
    { label: 'Пользователь', name: 'user', sort: 'user.name:string' },
    { label: 'Задача', name: 'task', sort: 'task.number:number' },
    { label: 'Спринт', name: 'sprint', sort: 'sprint.name:string' },
    { label: 'Потраченное время (ч.)', name: 'spent', sort: 'spent:number' }
  ];

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

  public chartDataSpent = {
    labels: [],
    datasets: [
      {
        label: 'Отработанные часы',
        backgroundColor: '#42A5F5',
        data: []
      }
    ]
  };

  public basicOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      },
      y: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  };

  @ViewChild('chartSpent') public chartSpent: UIChart;

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
      this.data = res;
      this.chartDataSpent.labels = res.sums.usersInfo.map((userInfo) => userInfo.user?.name ? userInfo.user?.name : userInfo.user?.login);
      this.chartDataSpent.datasets[0].data = res.sums.usersInfo.map((userInfo) => userInfo.spent);
      this.chartSpent?.refresh();
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
