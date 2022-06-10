import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { UserService } from "@scrum/web/core/services/user/user.service";

@Component({
  selector: 'grace-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  public constructor(private readonly userService: UserService) {}

  public ngOnInit(): void {

  }
}
