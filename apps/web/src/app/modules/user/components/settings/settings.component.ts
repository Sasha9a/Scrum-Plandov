import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RecoveryFormDto } from "@scrum/shared/dtos/recovery/recovery.form.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { UserEditFormDto } from "@scrum/shared/dtos/user/user.edit.form.dto";
import { UserPasswordFormDto } from "@scrum/shared/dtos/user/user.password.form.dto";
import { ErrorService } from "@scrum/web/core/services/error.service";
import { AuthService } from "@scrum/web/core/services/user/auth.service";
import { UserService } from "@scrum/web/core/services/user/user.service";
import { MenuItem } from "primeng/api";

@Component({
  selector: 'grace-settings',
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {

  public loading = false;
  public nextStep = false;

  public itemsMenu: MenuItem[] = [
    { id: 'info', label: 'Информация', icon: 'pi pi-info-circle', command: item => this.activeItemMenu = item.item },
    { id: 'edit', label: 'Редактирование', icon: 'pi pi-pencil', command: item => this.activeItemMenu = item.item },
    { id: 'pass', label: 'Смена пароля', icon: 'pi pi-key', command: item => this.activeItemMenu = item.item },
    { id: 'email', label: 'Смена email', icon: 'pi pi-at', command: item => this.activeItemMenu = item.item }
  ];

  public activeItemMenu: MenuItem;

  public constructor(public readonly authService: AuthService,
                     private readonly userService: UserService,
                     public readonly cdRef: ChangeDetectorRef,
                     private readonly errorService: ErrorService) {}

  public ngOnInit(): void {
    this.activeItemMenu = this.itemsMenu[0];

    this.userService.findById<UserDto>(this.authService.currentUser?._id).subscribe((user) => {
      this.authService.updateLoggedUser({ ...user });
    });
  }

  public edit(user: UserEditFormDto) {
    this.userService.update<UserEditFormDto, UserDto>(this.authService.currentUser?._id, { login: user.login, name: user.name }).subscribe({
      next: () => {
        this.authService.updateLoggedUser({ name: user.name, login: user.login });
        this.errorService.addSuccessMessage('Изменения сохранены');
        this.loading = false;
        this.cdRef.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdRef.markForCheck();
      }
    });
  }

  public changePassword(data: UserPasswordFormDto) {
    this.loading = true;
    this.cdRef.markForCheck();

    this.userService.changePassword(data).subscribe({
      next: () => {
        this.errorService.addSuccessMessage('Пароль успешно изменен');
        this.loading = false;
        this.cdRef.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdRef.markForCheck();
      }
    });
  }

  public changeEmail(data: RecoveryFormDto) {
    this.loading = true;
    this.cdRef.markForCheck();

    this.userService.taskChangeEmail(data).subscribe({
      next: () => {
        this.loading = false;
        this.nextStep = true;
        this.cdRef.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdRef.markForCheck();
      }
    });
  }

}
