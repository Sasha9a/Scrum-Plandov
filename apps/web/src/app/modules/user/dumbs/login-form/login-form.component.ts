import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserLoginFormDto } from '@scrum/shared/dtos/user/user.login.form.dto';
import { BaseFormComponent } from '@scrum/web/shared/dumbs/base-form/base-form.component';

@Component({
  selector: 'scrum-login-form',
  templateUrl: './login-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent extends BaseFormComponent<UserLoginFormDto> {
  public userLogin = new UserLoginFormDto();
  public dto = UserLoginFormDto;
}
