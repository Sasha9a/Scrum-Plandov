import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RoutingService } from '@scrum/web/core/services/routing.service';

@Component({
  selector: 'scrum-go-back-button',
  template: `
    <button
      pButton
      [label]="label"
      [class]="buttonClass"
      (click)="btnClick()"></button>
  `
})
export class GoBackButtonComponent {
  @Input() public label = 'Отмена';
  @Input() public buttonClass = 'p-button-secondary p-button-text';

  @Input() public route = '/';
  @Input() public queryParams: { [k: string]: string } = {};

  public constructor(private readonly router: Router, public routingService: RoutingService) {}

  public btnClick() {
    if (this.routingService.previousUrl === '/') {
      this.router.navigate([this.route], { queryParams: this.queryParams }).catch(console.error);
    } else {
      this.routingService.goToPreviousUrl(this.queryParams);
    }
  }
}
