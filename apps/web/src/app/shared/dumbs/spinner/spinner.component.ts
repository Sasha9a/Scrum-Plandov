import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: 'grace-spinner',
  templateUrl: './spinner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {

  @Input() public text = 'Загрузка...';

}
