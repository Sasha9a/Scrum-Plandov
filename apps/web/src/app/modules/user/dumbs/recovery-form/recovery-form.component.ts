import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RecoveryFormDto } from '@scrum/shared/dtos/recovery/recovery.form.dto';
import { BaseFormComponent } from '@scrum/web/shared/dumbs/base-form/base-form.component';

@Component({
  selector: 'scrum-recovery-form',
  templateUrl: './recovery-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecoveryFormComponent extends BaseFormComponent<RecoveryFormDto> {
  public recovery = new RecoveryFormDto();
  public dto = RecoveryFormDto;

  @Input() public textButton = 'Восстановить';
}
