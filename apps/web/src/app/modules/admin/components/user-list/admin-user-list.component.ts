import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserDto } from '@scrum/shared/dtos/user/user.dto';
import { CrmTableColumn } from '@scrum/web/core/models/crm-table-column';
import { UserService } from '@scrum/web/core/services/user/user.service';

@Component({
  selector: 'scrum-admin-user-list',
  templateUrl: './admin-user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUserListComponent implements OnInit {
  public loading = false;
  public users: UserDto[];

  public columns: CrmTableColumn[] = [
    { label: 'Логин', name: 'login', sort: 'login:string' },
    { label: 'Почта', name: 'email', sort: 'email:string' },
    { label: 'Дата создания', name: 'registerDate', sort: 'registerDate:date' },
    { label: 'Последняя активность', name: 'lastEntranceDate', sort: 'lastEntranceDate:date' },
    { label: 'Статус', name: 'isValidatedEmail', sort: 'isValidatedEmail:string' },
    { label: 'Роли' }
  ];

  public constructor(private readonly userService: UserService, private readonly cdRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.loadUsers();
  }

  public loadUsers() {
    this.loading = true;
    this.cdRef.markForCheck();

    this.userService.find<UserDto>().subscribe({
      next: (users) => {
        this.users = users;
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
