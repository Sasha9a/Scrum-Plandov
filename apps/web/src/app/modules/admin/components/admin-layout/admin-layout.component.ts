import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'scrum-admin-layout',
  templateUrl: './admin-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent {
  public itemsMenu: MenuItem[] = [
    {
      id: 'boards',
      label: 'Пользователи',
      icon: 'pi pi-users',
      routerLink: `/admin/user/list`,
      command: (value) => this.setActiveItem(value)
    }
  ];
  public activeItemMenu: MenuItem;

  public constructor(private readonly cdRef: ChangeDetectorRef) {}

  public setActiveItem(value: { item: MenuItem }): void {
    this.activeItemMenu = this.itemsMenu.find((item) => {
      return item.routerLink === value.item.routerLink;
    });
    this.cdRef.markForCheck();
  }
}
