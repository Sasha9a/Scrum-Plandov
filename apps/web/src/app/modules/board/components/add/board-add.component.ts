import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { BoardDto } from '@scrum/shared/dtos/board/board.dto';
import { BoardFormDto } from '@scrum/shared/dtos/board/board.form.dto';
import { UserDto } from '@scrum/shared/dtos/user/user.dto';
import { BoardService } from '@scrum/web/core/services/board/board.service';
import { ErrorService } from '@scrum/web/core/services/error.service';
import { AuthService } from '@scrum/web/core/services/user/auth.service';
import { UserService } from '@scrum/web/core/services/user/user.service';

@Component({
  selector: 'scrum-board-add',
  templateUrl: './board-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardAddComponent {
  public board = new BoardFormDto();
  public saving = false;

  public users: UserDto[] = [];

  public constructor(
    private readonly boardService: BoardService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly errorService: ErrorService,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  public searchUser(login: string) {
    if (login.length > 1) {
      this.userService.searchUsers({ q: login }).subscribe((users) => {
        this.users = users;
        this.users = this.users.filter((user) => user._id !== this.authService.currentUser?._id);
        this.cdRef.markForCheck();
      });
    }
  }

  public create(body: BoardFormDto) {
    this.saving = true;
    this.cdRef.markForCheck();

    this.boardService.create<BoardFormDto, BoardDto>(body).subscribe({
      next: (board) => {
        this.saving = false;
        this.cdRef.markForCheck();
        this.errorService.addSuccessMessage('Доска создана');
        this.router.navigate(['/board/card', board._id]).catch(console.error);
      },
      error: () => {
        this.saving = false;
        this.board = body;
        this.cdRef.markForCheck();
      }
    });
  }
}
