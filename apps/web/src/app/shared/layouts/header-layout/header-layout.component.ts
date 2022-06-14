import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FileDto } from "@scrum/shared/dtos/file.dto";
import { ErrorService } from "@scrum/web/core/services/error.service";
import { AuthService } from "@scrum/web/core/services/user/auth.service";
import { MenuItem } from "primeng/api";
import { Subscription } from "rxjs";

@Component({
  selector: 'grace-header-layout',
  templateUrl: './header-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderLayoutComponent implements OnInit, OnDestroy {

  public menuHeader: MenuItem[] = [];
  public userAvatar: { name: string, login: string, file?: FileDto };

  private header$: Subscription;

  public constructor(public readonly authService: AuthService,
                     private readonly errorService: ErrorService,
                     private readonly router: Router,
                     private readonly cdRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.header$ = this.authService.loginUser$.subscribe((user) => {
      this.userAvatar = {
        name: user?.name,
        login: user?.login,
        file: user?.avatar
      };
      this.cdRef.markForCheck();
    });

    this.authService.loginUser$.next(this.authService.currentUser);

    this.loadMenu();
  }

  public ngOnDestroy() {
    this.header$?.unsubscribe();
  }

  public loadMenu() {
    this.menuHeader = [
      {
        label: 'Доски',
        routerLink: '/board'
      },
      {
        label: 'Настройки',
        routerLink: '/user/settings'
      },
      {
        separator: true
      },
      {
        label: 'Выйти',
        command: () => {
          this.authService.logout(location.pathname);
        }
      }
    ];
  }

}
