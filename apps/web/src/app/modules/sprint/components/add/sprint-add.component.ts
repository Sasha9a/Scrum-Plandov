import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { SprintDto } from "@scrum/shared/dtos/sprint/sprint.dto";
import { SprintFormDto } from "@scrum/shared/dtos/sprint/sprint.form.dto";
import { BoardService } from "@scrum/web/core/services/board/board.service";
import { ErrorService } from "@scrum/web/core/services/error.service";
import { SprintService } from "@scrum/web/core/services/sprint/sprint.service";

@Component({
  selector: 'grace-add',
  templateUrl: './sprint-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SprintAddComponent implements OnInit {

  public boardId: string;
  public saving = false;

  public board: BoardDto;

  public constructor(public readonly sprintService: SprintService,
                     public readonly boardService: BoardService,
                     private readonly route: ActivatedRoute,
                     private readonly cdRef: ChangeDetectorRef,
                     private readonly router: Router,
                     private readonly errorService: ErrorService) {}

  public ngOnInit(): void {
    this.boardId = this.route.snapshot.queryParams.boardId;

    if (!this.boardId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.boardService.findById<BoardDto>(this.boardId).subscribe((board) => {
      this.board = board;
      this.cdRef.markForCheck();
    });
  }

  public create(body: SprintFormDto) {
    this.saving = true;
    this.cdRef.markForCheck();

    this.sprintService.create<SprintFormDto, SprintDto>(body).subscribe({
      next: () => {
        this.saving = false;
        this.cdRef.markForCheck();
        this.errorService.addSuccessMessage('Спринт создан');
        this.router.navigate(['/board/card', this.boardId]).catch(console.error);
      },
      error: () => {
        this.saving = false;
        this.cdRef.markForCheck();
      }
    });
  }
}
