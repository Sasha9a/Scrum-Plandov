import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from "@scrum/web/core/services/user/auth.service";
import { MenuItem } from "primeng/api";

@Component({
  selector: 'grace-settings',
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {

  public loading = false;

  public itemsMenu: MenuItem[] = [
    { id: 'info', label: 'Информация', icon: 'pi pi-info-circle', command: item => this.activeItemMenu = item.item },
    { id: 'edit', label: 'Редактирование', icon: 'pi pi-pencil', command: item => this.activeItemMenu = item.item },
    { id: 'pass', label: 'Смена пароля', icon: 'pi pi-key', command: item => this.activeItemMenu = item.item },
    { id: 'email', label: 'Смена email', icon: 'pi pi-at', command: item => this.activeItemMenu = item.item }
  ];

  public activeItemMenu: MenuItem;

  public constructor(public readonly authService: AuthService) {}

  public ngOnInit(): void {
    this.activeItemMenu = this.itemsMenu[0];
  }
}
