import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDto } from "@scrum/shared/dtos/user/user.dto";

@Component({
  selector: 'grace-user-multi-select',
  templateUrl: './user-multi-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMultiSelectComponent {
  @Input() public users: UserDto[] = [];

  @Input() public selectedUsers: UserDto[] = [];
  @Output() public selectedUsersChange = new EventEmitter<UserDto[]>();

  @Input() public labelInput = false;

  public toUser(user: any): UserDto {
    return user as UserDto;
  }
}
