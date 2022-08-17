import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from "@angular/core";
import { Router } from "@angular/router";
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { BoardService } from "@scrum/web/core/services/board/board.service";
import { ErrorService } from "@scrum/web/core/services/error.service";
import { AuthService } from "@scrum/web/core/services/user/auth.service";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
  selector: 'grace-board-leave-dialog',
  templateUrl: './board-leave-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardLeaveDialogComponent {

  public board: BoardDto;
  public loading = false;

  public userSelect: UserDto;

  public constructor(public readonly authService: AuthService,
                     private readonly boardService: BoardService,
                     private readonly cdRef: ChangeDetectorRef,
                     private readonly errorService: ErrorService,
                     private readonly router: Router,
                     private readonly config: DynamicDialogConfig,
                     private readonly ref: DynamicDialogRef) {
    this.board = config.data.board;
  }

  public leaveBoard() {
    this.loading = true;
    this.cdRef.markForCheck();

    this.boardService.leave(this.board._id, { user: this.userSelect }).subscribe({
      next: () => {
        this.ref.close();
        this.loading = false;
        this.cdRef.markForCheck();
        this.errorService.addSuccessMessage(`Вы успешно покинули доску "${this.board?.name}"`);
        this.router.navigate(['/board']).catch(console.error);
      },
      error: () => {
        this.loading = false;
        this.cdRef.markForCheck();
      }
    });
  }
}
