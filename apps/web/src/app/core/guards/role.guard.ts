import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { RoutingService } from '@scrum/web/core/services/routing.service';
import { AuthService } from '@scrum/web/core/services/user/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  public constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly routingService: RoutingService
  ) {}

  public async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    if (Array.isArray(this.authService.currentUser?.roles)) {
      if (route.data?.included === true && this.authService.currentUser?.roles?.some((role) => route.data?.roles.includes(role))) {
        return true;
      }

      if (route.data?.included === false && this.authService.currentUser?.roles?.every((role) => !route.data?.roles.includes(role))) {
        return true;
      }
    } else {
      if (route.data?.included === true && route.data?.roles.includes(this.authService.currentUser?.roles)) {
        return true;
      }

      if (route.data?.included === false && !route.data?.roles.includes(this.authService.currentUser?.roles)) {
        return true;
      }
    }

    this.routingService.goToPreviousUrl();
    return false;
  }
}
