import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLoginFormDto } from '@scrum/shared/dtos/user/user.login.form.dto';
import { ErrorService } from '@scrum/web/core/services/error.service';
import { AuthService } from '@scrum/web/core/services/user/auth.service';

@Component({
  selector: 'scrum-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  public loading = false;

  private url: string;
  private queryParams: any;

  public constructor(
    private readonly authService: AuthService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly errorService: ErrorService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.url = this.route.snapshot.queryParams['url'] || '/';
    this.queryParams = this.url.split('?')[1] || '';

    this.url = this.url.split('?')[0] || this.url;
    this.queryParams = this.queryParams
      ? JSON.parse('{"' + decodeURI(this.queryParams.replace(/&/g, '","').replace(/=/g, '":"')) + '"}')
      : {};

    if (this.authService.currentUser) {
      this.router.navigate([this.url], { queryParams: this.queryParams }).catch(console.error);
    }
  }

  public login(body: UserLoginFormDto) {
    this.loading = true;
    this.cdRef.markForCheck();

    this.authService.login(body).subscribe({
      next: () => {
        this.loading = false;
        this.cdRef.markForCheck();
        this.errorService.addSuccessMessage('Вы авторизовались!');
        if (this.url === '/') {
          this.router.navigate(['/board']).catch(console.error);
        } else {
          this.router.navigate([this.url], { queryParams: this.queryParams }).catch(console.error);
        }
      },
      error: () => {
        this.loading = false;
        this.cdRef.markForCheck();
      }
    });
  }
}
