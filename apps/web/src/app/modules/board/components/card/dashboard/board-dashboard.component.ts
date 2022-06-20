import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from "@angular/router";
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { ConfirmDialogService } from "@scrum/web/core/services/confirm-dialog.service";
import { ErrorService } from "@scrum/web/core/services/error.service";
import { AuthService } from "@scrum/web/core/services/user/auth.service";

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

  public constructor(public readonly authService: AuthService,
                     private readonly confirmService: ConfirmDialogService,
                     private readonly cdRef: ChangeDetectorRef,
                     private readonly errorService: ErrorService,
                     private readonly router: Router) {}

  public ngOnInit(): void {

  }

  public leaveBoard() {
    this.confirmService.confirm({
      message: `Вы действительно хотите покинуть доску "${this.board.name}"?`,
      accept: () => {
        this.loading = true;
        this.cdRef.markForCheck();

        this.boardService.deleteById(this.boardId).subscribe(() => {
          this.loading = false;
          this.cdRef.markForCheck();
          this.errorService.addSuccessMessage(`Вы успешно покинули доску "${this.board.name}"`);
          this.router.navigate(['/board']).catch(console.error);
        });
      }
    });
  }

}
