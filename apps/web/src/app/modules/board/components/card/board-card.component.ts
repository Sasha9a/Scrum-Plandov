import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ErrorService } from "@scrum/web/core/services/error.service";
import { MenuItem } from "primeng/api";

@Component({
  selector: 'grace-board-card',
  templateUrl: './board-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardCardComponent implements OnInit {

  public itemsMenu: MenuItem[] = [];
  public activeItemMenu: MenuItem;

  public constructor(private readonly route: ActivatedRoute,
                     private readonly errorService: ErrorService,
                     private readonly router: Router,
                     private readonly cdRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    const boardId = this.route.snapshot.params.id;

    if (!boardId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.itemsMenu = [
      { id: 'board', label: 'Доска', icon: 'pi pi-table', routerLink: `/board/card/${boardId}/dashboard`, command: (value) => this.setActiveItem(value) },
      { id: 'sprint', label: 'Спринты', icon: 'pi pi-sitemap', routerLink: `/board/card/${boardId}/sprint`, command: (value) => this.setActiveItem(value) },
      { id: 'report', label: 'Отчеты', icon: 'pi pi-chart-bar', routerLink: `/board/card/${boardId}/report`, command: (value) => this.setActiveItem(value) }
    ];

    this.activeItemMenu = this.findCurrentItem();
    this.cdRef.markForCheck();
  }

  public findCurrentItem(): MenuItem {
    return this.itemsMenu.find((item) => {
      return item.routerLink === this.router.url.split('?')[0];
    });
  }

  public setActiveItem(value: { item: MenuItem }): void {
    this.activeItemMenu = this.itemsMenu.find((item) => {
      return item.routerLink === value.item.routerLink;
    });
    this.cdRef.markForCheck();
  }

}
