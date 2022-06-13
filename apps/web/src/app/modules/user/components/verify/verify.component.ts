import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { VerifyDto } from "@scrum/shared/dtos/verify/verify.dto";
import { VerifyEmailTypeEnum } from "@scrum/shared/enums/verify.email.type.enum";
import { VerifyService } from "@scrum/web/core/services/verify/verify.service";

@Component({
  selector: 'grace-verify',
  templateUrl: './verify.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyComponent implements OnInit {

  public verifyInfo: VerifyDto;
  public loading = true;

  public get VerifyEmailTypeEnum() {
    return VerifyEmailTypeEnum;
  }

  public constructor(private readonly verifyService: VerifyService,
                     private readonly route: ActivatedRoute,
                     private readonly cdRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    const path = this.route.snapshot.params.path;

    this.verifyService.findByPath(path).subscribe({
      next: (res) => {
        this.verifyInfo = res;
        if (res) {
          this.verifyService.deleteById(res._id).subscribe();
        }
        this.loading = false;
        this.cdRef.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdRef.markForCheck();
      }
    });
  }
}
