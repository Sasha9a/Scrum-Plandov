import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RecoveryPasswordFormDto } from "@scrum/shared/dtos/recovery/recovery.password.form.dto";
import { UserPasswordFormDto } from "@scrum/shared/dtos/user/user.password.form.dto";
import { VerifyDto } from "@scrum/shared/dtos/verify/verify.dto";
import { VerifyEmailTypeEnum } from "@scrum/shared/enums/verify.email.type.enum";
import { UserService } from "@scrum/web/core/services/user/user.service";
import { VerifyService } from "@scrum/web/core/services/verify/verify.service";

@Component({
  selector: 'grace-verify',
  templateUrl: './verify.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyComponent implements OnInit {

  public path: string;
  public verifyInfo: VerifyDto;
  public loading = true;

  public recoveryStep = false;

  public get VerifyEmailTypeEnum() {
    return VerifyEmailTypeEnum;
  }

  public constructor(private readonly verifyService: VerifyService,
                     private readonly userService: UserService,
                     private readonly route: ActivatedRoute,
                     private readonly cdRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.path = this.route.snapshot.params.path;

    this.verifyService.findByPath(this.path).subscribe({
      next: (res) => {
        this.verifyInfo = res;
        if (res && res.type === VerifyEmailTypeEnum.REGISTER) {
          this.verifyService.deleteById(res._id).subscribe();
        }
        if (res.type === VerifyEmailTypeEnum.CHANGE) {
          this.userService.changeEmail({ path: res.path }).subscribe({
            next: () => {
              this.loading = false;
              this.verifyService.deleteById(res._id).subscribe();
              this.cdRef.markForCheck();
            }
          });
        } else {
          this.loading = false;
          this.cdRef.markForCheck();
        }
      },
      error: () => {
        this.loading = false;
        this.cdRef.markForCheck();
      }
    });
  }

  public recovery(body: UserPasswordFormDto) {
    this.loading = true;
    this.cdRef.markForCheck();

    const recoveryInfo: RecoveryPasswordFormDto = {
      path: this.path,
      ...body
    };

    this.userService.recoveryPassword(recoveryInfo).subscribe({
      next: () => {
        this.loading = false;
        this.recoveryStep = true;
        this.verifyService.deleteById(this.verifyInfo._id).subscribe();
        this.cdRef.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdRef.markForCheck();
      }
    });
  }
}
