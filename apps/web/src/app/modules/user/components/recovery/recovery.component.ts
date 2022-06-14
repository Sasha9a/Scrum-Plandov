import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { RecoveryFormDto } from "@scrum/shared/dtos/recovery/recovery.form.dto";
import { UserService } from "@scrum/web/core/services/user/user.service";

@Component({
  selector: 'grace-recovery',
  templateUrl: './recovery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecoveryComponent {

  public loading = false;
  public nextStep = false;

  public constructor(private readonly userService: UserService,
                     private readonly cdRef: ChangeDetectorRef) {}

  public click(body: RecoveryFormDto) {
    this.loading = true;
    this.cdRef.markForCheck();

    this.userService.recovery(body).subscribe({
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
