import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from "@angular/core";
import { UserCreateFormDto } from "@scrum/shared/dtos/user/user.create.form.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { VerifyCreateDto } from "@scrum/shared/dtos/verify/verify.create.dto";
import { VerifyDto } from "@scrum/shared/dtos/verify/verify.dto";
import { VerifyEmailTypeEnum } from "@scrum/shared/enums/verify.email.type.enum";
import { AuthService } from "@scrum/web/core/services/user/auth.service";
import { UserService } from "@scrum/web/core/services/user/user.service";
import { VerifyService } from "@scrum/web/core/services/verify/verify.service";
import { forkJoin } from "rxjs";
import * as uuid from "uuid";

@Component({
  selector: 'grace-register',
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {

  public loading = false;

  public isBusyLogin: boolean;

  public constructor(private readonly userService: UserService,
                     private readonly authService: AuthService,
                     private readonly cdRef: ChangeDetectorRef,
                     private readonly verifyService: VerifyService) {}

  public checkLogin(login: string) {
    this.userService.checkLogin({ login: login }).subscribe((res) => {
      this.isBusyLogin = true;
      this.cdRef.markForCheck();
    });
  }

  public create(user: UserCreateFormDto) {
    this.loading = true;

    forkJoin([
      this.userService.create<UserCreateFormDto, UserDto>(user),
      this.verifyService.create<VerifyCreateDto, VerifyDto>({
        path: uuid.v4(),
        type: VerifyEmailTypeEnum.REGISTER,
        email: user.email
      })
    ]).subscribe({
      next: () => {
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

}
