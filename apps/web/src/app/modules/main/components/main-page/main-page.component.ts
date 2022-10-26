import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'scrum-main-page',
  templateUrl: './main-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent {}
