import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserPasswordFormDto } from "@scrum/shared/dtos/user/user.password.form.dto";
import { UserPasswordService } from "@scrum/web/core/services/user/user-password.service";
import { BaseFormComponent } from "@scrum/web/shared/dumbs/base-form/base-form.component";

@Component({
  selector: 'grace-change-password-form',
  templateUrl: './change-password-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordFormComponent extends BaseFormComponent<UserPasswordFormDto> {

  public userInfo = new UserPasswordFormDto();
  public dto = UserPasswordFormDto;

  public passwordRepeatError: string;

  public constructor(private readonly passwordService: UserPasswordService) {
    super();
  }

  public generatePassword() {
    this.userInfo.password = this.passwordService.generatePassword();
  }

  public override onSave(entity: UserPasswordFormDto) {
    if (this.userInfo?.password !== this.userInfo?.repeatPassword) {
      this.passwordRepeatError = 'Пароли не совпадают';
    } else {
      this.passwordRepeatError = '';
      super.onSave(entity);
    }
  }

}
