import { Injectable } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { TitleService } from '@scrum/web/core/services/title.service';
import { AuthService } from '@scrum/web/core/services/user/auth.service';
import { filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {
  public currentUrl = '/';
  public previousUrl = '/';

  public constructor(
    private readonly router: Router,
    private readonly titleService: TitleService,
    private readonly authService: AuthService
  ) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.url;
    });

    this.router.events
      .pipe(
        filter(
          (event) => event instanceof ActivationEnd && !event.snapshot.routeConfig?.children && !event.snapshot.routeConfig?.loadChildren
        ),
        map((event: ActivationEnd) => event.snapshot.data)
      )
      .subscribe((routeData) => {
        if (routeData.onlyNotAuth && this.authService.currentUser) {
          this.router.navigate(['/board']).catch(console.error);
        }
        this.titleService.setTitle(routeData.title);
      });
  }

  public goToPreviousUrl(queryParams?: { [k: string]: string }) {
    this.router.navigate([this.previousUrl], { queryParams: queryParams }).catch(console.error);
  }
}
