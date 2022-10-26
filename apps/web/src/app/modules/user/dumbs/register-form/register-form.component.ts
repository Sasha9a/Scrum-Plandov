import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UserCreateFormDto } from '@scrum/shared/dtos/user/user.create.form.dto';
import { UserPasswordService } from '@scrum/web/core/services/user/user-password.service';
import { UserService } from '@scrum/web/core/services/user/user.service';
import { validate } from '@scrum/web/core/services/validation/validate.service';
import { BaseFormComponent } from '@scrum/web/shared/dumbs/base-form/base-form.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'scrum-register-form',
  templateUrl: './register-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterFormComponent extends BaseFormComponent<UserCreateFormDto> {
  public userRegister = new UserCreateFormDto();
  public dto = UserCreateFormDto;

  @Input() public loading = false;
  @Output() public loadingChange = new EventEmitter<boolean>();

  public isChangePasswordFromEmail = true;

  public passwordRepeat: string;
  public errorPasswordRepeat: string;
  public errorLogin: string;
  public errorEmail: string;

  public constructor(private readonly passwordService: UserPasswordService, private readonly userService: UserService) {
    super();
  }

  public generatePassword() {
    this.userRegister.password = this.passwordService.generatePassword();
  }

  public changeEmail(email: string) {
    const login = email?.split('@')[0];
    if (this.isChangePasswordFromEmail) {
      this.userRegister.login = login;
    }
  }

  public changeLogin(login: string) {
    if (this.isChangePasswordFromEmail) {
      this.isChangePasswordFromEmail = false;
    }
    if (!login || !login?.length) {
      this.isChangePasswordFromEmail = true;
    }
  }

  public override onSave(entity: UserCreateFormDto) {
    const { valid, errors } = validate(entity, this.dto);
    if (!valid) {
      this.errors = errors;
      console.log(entity);
      console.log(this.errors);
    } else {
      this.errors = null;
      if (this.passwordRepeat !== this.userRegister.password || !this.userRegister.password) {
        this.errorPasswordRepeat = 'Пароли не совпадают';
        return;
      }
      this.loading = true;
      this.loadingChange.emit(this.loading);
      forkJoin([
        this.userService.checkLogin({ login: this.userRegister.login }),
        this.userService.checkEmail({ email: this.userRegister.email })
      ]).subscribe(([checkLogin, checkEmail]) => {
        if (checkEmail.isBusy) {
          this.errorEmail = 'Почта занята';
        } else {
          this.errorEmail = '';
        }
        if (checkLogin.isBusy) {
          this.errorLogin = 'Логин занят';
        } else {
          this.errorLogin = '';
        }
        if (!checkEmail.isBusy && !checkLogin.isBusy) {
          this.save.emit(entity);
        } else {
          this.loading = false;
          this.loadingChange.emit(this.loading);
        }
      });
    }
  }
}
