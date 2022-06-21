import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from "@angular/router";
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { BoardService } from "@scrum/web/core/services/board/board.service";
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

  public userSelect: UserDto;
  public loadingLeave = false;

  public constructor(public readonly authService: AuthService,
                     private readonly boardService: BoardService,
                     private readonly confirmService: ConfirmDialogService,
                     private readonly cdRef: ChangeDetectorRef,
                     private readonly errorService: ErrorService,
                     private readonly router: Router) {}

  public ngOnInit(): void {

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

}
