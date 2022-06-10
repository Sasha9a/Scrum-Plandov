import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FileDto } from "@scrum/shared/dtos/file.dto";

@Component({
  selector: 'grace-user-avatar',
  templateUrl: './user-avatar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAvatarComponent {

  @Input() public user: { name: string, file?: FileDto };
  @Input() public size = 'large';
  @Input() public shape: 'circle' | 'square' = 'circle';

  public get userLabel() {
    const [firstName, secondName] = (this.user?.name || '').split(' ');
    return (firstName ? firstName[0] : '') + (secondName ? secondName[0] : '');
  }

}
