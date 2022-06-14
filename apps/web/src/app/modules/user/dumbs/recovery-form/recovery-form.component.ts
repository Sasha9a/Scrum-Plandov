import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RecoveryFormDto } from "@scrum/shared/dtos/recovery/recovery.form.dto";
import { BaseFormComponent } from "@scrum/web/shared/dumbs/base-form/base-form.component";

@Component({
  selector: 'grace-recovery-form',
  templateUrl: './recovery-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecoveryFormComponent extends BaseFormComponent<RecoveryFormDto> {

  public recovery = new RecoveryFormDto();
  public dto = RecoveryFormDto;

}
