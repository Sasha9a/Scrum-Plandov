import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { SprintTasksInfoDto } from "@scrum/shared/dtos/sprint/sprint.tasks.info.dto";
import { SprintService } from "@scrum/web/core/services/sprint/sprint.service";

@Component({
  selector: 'grace-board-sprint',
  templateUrl: './board-sprint.component.html',
  styleUrls: ['./board-sprint.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardSprintComponent implements OnInit {

  @Input() public board: BoardDto;
  public loading = true;

  public sprints: SprintTasksInfoDto[];

  public constructor(private readonly sprintService: SprintService,
                     private readonly cdRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.sprintService.findAllByBoard(this.board?._id).subscribe((sprints) => {
      this.sprints = sprints;
      this.loading = false;
      this.cdRef.markForCheck();
    });
  }
}
