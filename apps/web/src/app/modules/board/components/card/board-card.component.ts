import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { BoardService } from "@scrum/web/core/services/board/board.service";
import { ErrorService } from "@scrum/web/core/services/error.service";
import { TitleService } from "@scrum/web/core/services/title.service";
import { MenuItem } from "primeng/api";

@Component({
  selector: 'grace-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardCardComponent implements OnInit {

  public loading = true;
  public board: BoardDto;

  public itemsMenu: MenuItem[] = [
    { id: 'board', label: 'Доска', icon: 'pi pi-table', command: item => this.activeItemMenu = item.item },
    { id: 'sprint', label: 'Спринты', icon: 'pi pi-sitemap', command: item => this.activeItemMenu = item.item },
    { id: 'report', label: 'Отчеты', icon: 'pi pi-chart-bar', command: item => this.activeItemMenu = item.item }
  ];

  public activeItemMenu: MenuItem;

  public constructor(private readonly boardService: BoardService,
                     private readonly route: ActivatedRoute,
                     private readonly errorService: ErrorService,
                     private readonly cdRef: ChangeDetectorRef,
                     private readonly titleService: TitleService) {}

  public ngOnInit(): void {
    const boardId = this.route.snapshot.params.id;
    this.activeItemMenu = this.itemsMenu[0];

    if (!boardId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.boardService.findById<BoardDto>(boardId).subscribe((board) => {
      this.board = board;
      this.loading = false;
      this.titleService.setTitle(`${this.board?.name}`);
      this.cdRef.markForCheck();
    });
  }

}
