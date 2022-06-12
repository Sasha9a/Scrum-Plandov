import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from "@angular/core";
import { UserCreateFormDto } from "@scrum/shared/dtos/user/user.create.form.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { UserService } from "@scrum/web/core/services/user/user.service";

@Component({
  selector: 'grace-register',
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {

  public loading = false;

  public constructor(private readonly userService: UserService,
                     private readonly cdRef: ChangeDetectorRef) {}

  public create(user: UserCreateFormDto) {
    this.userService.create<UserCreateFormDto, UserDto>(user).subscribe({
      next: () => {
        this.loading = false;
        this.cdRef.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdRef.markForCheck();
      }
    });
  }

}
