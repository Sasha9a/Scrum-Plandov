import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FileDto } from '@scrum/shared/dtos/file.dto';
import { UserDto } from '@scrum/shared/dtos/user/user.dto';
import { UserEditFormDto } from '@scrum/shared/dtos/user/user.edit.form.dto';
import { AuthService } from '@scrum/web/core/services/user/auth.service';
import { UserService } from '@scrum/web/core/services/user/user.service';
import { validate } from '@scrum/web/core/services/validation/validate.service';
import { BaseFormComponent } from '@scrum/web/shared/dumbs/base-form/base-form.component';

@Component({
  selector: 'scrum-user-edit-form',
  templateUrl: './user-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEditFormComponent extends BaseFormComponent<UserEditFormDto> {
  @Input() public user = new UserEditFormDto();
  public dto = UserEditFormDto;

  @Input() public loading = false;
  @Output() public loadingChange = new EventEmitter<boolean>();

  public showAvatar = false;

  public errorLogin: string;

  public constructor(private readonly userService: UserService, private readonly authService: AuthService) {
    super();
  }

  public onAvatarFileSelect(file: FileDto) {
    this.user.avatar = file;
    this.userService
      .update<Partial<UserDto>, UserDto>(this.authService.currentUser?._id, {
        avatar: file,
        login: this.authService.currentUser?.login,
        name: this.authService.currentUser?.name
      })
      .subscribe();
    this.authService.updateLoggedUser({ avatar: file });
  }

  public override onSave(entity: UserEditFormDto) {
    const { valid, errors } = validate(entity, this.dto);
    if (!valid) {
      this.errors = errors;
      console.log(entity);
      console.log(this.errors);
    } else {
      this.errors = null;
      this.loading = true;
      this.loadingChange.emit(this.loading);
      if (this.authService.currentUser?.login == entity.login) {
        this.errorLogin = '';
        this.save.emit(entity);
        return;
      }
      this.userService.checkLogin({ login: entity.login }).subscribe((res) => {
        if (res.isBusy) {
          this.errorLogin = 'Логин занят';
          this.loading = false;
          this.loadingChange.emit(this.loading);
        } else {
          this.errorLogin = '';
          this.save.emit(entity);
        }
      });
    }
  }
}
