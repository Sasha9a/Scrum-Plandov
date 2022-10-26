import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UserDto } from '@scrum/shared/dtos/user/user.dto';

@Component({
  selector: 'scrum-user-info',
  templateUrl: './user-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfoComponent {
  @Input() public user: UserDto;
  public showAvatar = false;
}
