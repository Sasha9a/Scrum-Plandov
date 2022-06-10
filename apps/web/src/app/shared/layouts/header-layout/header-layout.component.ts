import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FileDto } from "@scrum/shared/dtos/file.dto";
import { ErrorService } from "@scrum/web/core/services/error.service";
import { AuthService } from "@scrum/web/core/services/user/auth.service";
import { MenuItem } from "primeng/api";

@Component({
  selector: 'grace-header-layout',
  templateUrl: './header-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderLayoutComponent implements OnInit {

  public menuHeader: MenuItem[] = [];
  public userAvatar: { name: string, file?: FileDto };

  public constructor(public readonly authService: AuthService,
                     private readonly errorService: ErrorService,
                     private readonly router: Router) {}

  public ngOnInit(): void {
    this.userAvatar = {
      name: this.authService.currentUser?.name,
      file: this.authService.currentUser?.avatar
    };

    this.loadMenu();
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
          this.authService.logout();
          this.errorService.addSuccessMessage("Вы успешно вышли!");
          this.router.navigate(['']).catch(console.error);
        }
      }
    ];
  }

}
