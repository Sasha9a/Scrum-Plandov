import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'scrum-spinner',
  templateUrl: './spinner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {
  @Input() public text = 'Загрузка...';
}
