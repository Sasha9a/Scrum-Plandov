import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { UserCreateFormDto } from "@scrum/shared/dtos/user/user.create.form.dto";
import { UserPasswordService } from "@scrum/web/core/services/user/user-password.service";
import { BaseFormComponent } from "@scrum/web/shared/dumbs/base-form/base-form.component";

@Component({
  selector: 'grace-register-form',
  templateUrl: './register-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterFormComponent extends BaseFormComponent<UserCreateFormDto> implements OnChanges {

  public userRegister = new UserCreateFormDto();
  public dto = UserCreateFormDto;

  @Input() public isBusyLogin = false;
  @Output() public checkLogin = new EventEmitter<string>();

  public passwordRepeat: string;
  public errorPasswordRepeat: string;
  public errorLogin: string;

  public constructor(private readonly passwordService: UserPasswordService) {
    super();
  }

  public ngOnChanges() {
    this.textErrorLogin();
  }

  public generatePassword() {
    this.userRegister.password = this.passwordService.generatePassword();
  }

  public changeEmail() {
    const oldLogin = this.userRegister.login;
    this.userRegister.login = this.userRegister.email?.split('@')[0];
    if (this.userRegister.login?.length >= 5 && this.userRegister.login !== oldLogin) {
      this.checkLogin.emit(this.userRegister.login);
      this.textErrorLogin();
    }
    if (this.userRegister.login?.length < 5 && this.errorLogin) {
      this.errorLogin = '';
    }
  }

  public changeLogin() {
    if (this.userRegister.login?.length >= 5) {
      this.checkLogin.emit(this.userRegister.login);
      this.textErrorLogin();
    }
    if (this.userRegister.login?.length < 5 && this.errorLogin) {
      this.errorLogin = '';
    }
  }

  public changePassword() {
    if (this.passwordRepeat !== this.userRegister.password) {
      this.errorPasswordRepeat = 'Пароли не совпадают';
    } else {
      this.errorPasswordRepeat = '';
    }
  }

  public override onSave(entity: UserCreateFormDto) {
    if (this.passwordRepeat !== this.userRegister.password) {
      return;
    }
    super.onSave(entity);
  }

  public textErrorLogin() {
    if (this.isBusyLogin) {
      this.errorLogin = 'Логин занят';
    }
    if (!this.isBusyLogin) {
      this.errorLogin = '';
    }
  }

}
