import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { CrmTableColumn } from "@scrum/web/core/models/crm-table-column";
import { BoardService } from "@scrum/web/core/services/board/board.service";

@Component({
  selector: 'grace-board-list',
  templateUrl: './board-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardListComponent implements OnInit {

  public loading = true;
  public boards: BoardDto[];

  public columns: CrmTableColumn[] = [
    { label: 'Название', name: 'name', sort: 'name:string' },
    { label: 'Код', name: 'code', sort: 'code:string' },
    { label: 'Владелец' }
  ];

  public constructor(private readonly boardService: BoardService,
                     private readonly cdRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.boardService.findByMy().subscribe((boards) => {
      this.boards = boards;
      this.loading = false;
      this.cdRef.markForCheck();
    });
  }

  public toBoard(board: any): BoardDto {
    return board as BoardDto;
  }

}
