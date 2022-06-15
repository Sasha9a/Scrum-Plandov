import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { ErrorService } from "@scrum/web/core/services/error.service";
import { TitleService } from "@scrum/web/core/services/title.service";
import { UserService } from "@scrum/web/core/services/user/user.service";

@Component({
  selector: 'grace-user-card',
  templateUrl: './user-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent implements OnInit {

  public loading = true;
  public user: UserDto;

  public constructor(private readonly userService: UserService,
                     private readonly route: ActivatedRoute,
                     private readonly errorService: ErrorService,
                     private readonly titleService: TitleService,
                     private readonly cdRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    const userId = this.route.snapshot.params.id;

    if (!userId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.userService.findById<UserDto>(userId).subscribe((data) => {
      this.user = data;
      this.loading = false;
      this.titleService.setTitle(`${this.user?.name || this.user?.login}`);
      this.cdRef.markForCheck();
    });
  }
}
