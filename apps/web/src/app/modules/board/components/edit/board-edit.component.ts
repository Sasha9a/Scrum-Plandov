import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { BoardFormDto } from "@scrum/shared/dtos/board/board.form.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { BoardService } from "@scrum/web/core/services/board/board.service";
import { ConfirmDialogService } from '@scrum/web/core/services/confirm-dialog.service';
import { ErrorService } from "@scrum/web/core/services/error.service";
import { TitleService } from "@scrum/web/core/services/title.service";
import { AuthService } from "@scrum/web/core/services/user/auth.service";
import { UserService } from "@scrum/web/core/services/user/user.service";

@Component({
  selector: 'grace-board-edit',
  templateUrl: './board-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardEditComponent implements OnInit {

  public loading = false;
  public boardId: string;
  public board: BoardDto;

  public users: UserDto[] = [];

  public constructor(private readonly boardService: BoardService,
                     private readonly userService: UserService,
                     private readonly authService: AuthService,
                     private readonly route: ActivatedRoute,
                     private readonly errorService: ErrorService,
                     private readonly titleService: TitleService,
                     private readonly cdRef: ChangeDetectorRef,
                     private readonly router: Router,
                     private readonly confirmService: ConfirmDialogService) {}

  public ngOnInit(): void {
    this.boardId = this.route.snapshot.params.id;

    if (!this.boardId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.boardService.findById<BoardDto>(this.boardId).subscribe((data) => {
      this.board = data;
      this.loading = false;
      this.titleService.setTitle(`${this.board?.name}`);
      this.cdRef.markForCheck();
    });
  }

  public searchUser(login: string) {
    if (login.length > 1) {
      this.userService.searchUsers({ q: login }).subscribe((users) => {
        this.users = users;
        this.users = this.users.filter((user) => {
          return user._id !== this.authService.currentUser?._id && this.board.users.findIndex((_user) => _user?._id === user?._id) === -1;
        });
        this.cdRef.markForCheck();
      });
    }
  }

  public edit(body: BoardFormDto) {
    this.loading = true;
    this.cdRef.markForCheck();

    this.boardService.update(this.boardId, body).subscribe({
      next: () => {
        this.loading = false;
        this.cdRef.markForCheck();
        this.errorService.addSuccessMessage(`Доска "${body.name}" обновлена`);
        this.router.navigate(['/board/card', this.boardId]).catch(console.error);
      },
      error: () => {
        this.loading = false;
        this.cdRef.markForCheck();
      }
    });
  }

  public delete() {
    this.confirmService.confirm({
      message: `Вы действительно хотите удалить доску "${this.board.name}"?`,
      accept: () => {
        this.loading = true;
        this.cdRef.markForCheck();

        this.boardService.deleteById(this.boardId).subscribe(() => {
          this.loading = false;
          this.cdRef.markForCheck();
          this.errorService.addSuccessMessage(`Доска "${this.board.name}" удалена`);
          this.router.navigate(['/board']).catch(console.error);
        });
      }
    });
  }

}
