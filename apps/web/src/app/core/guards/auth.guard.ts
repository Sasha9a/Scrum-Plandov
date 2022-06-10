import { Injectable } from '@angular/core';
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "@scrum/web/core/services/user/auth.service";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public constructor(private readonly authService: AuthService,
                     private readonly router: Router) {
  }

  public canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated()
      .pipe(
        tap((authenticated) => {
          if (!authenticated) {
            this.router.navigate(['/login']).catch();
          }
        })
      );
  }

}
