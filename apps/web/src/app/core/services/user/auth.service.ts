import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { UserLoginFormDto } from "@scrum/shared/dtos/user/user.login.form.dto";
import { RoleEnum } from "@scrum/shared/enums/role.enum";
import { ErrorService } from "@scrum/web/core/services/error.service";
import { UserService } from "@scrum/web/core/services/user/user.service";
import { Observable, of, Subject, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInUser: Partial<UserDto> | undefined;
  public loginUser$: Subject<Partial<UserDto> | null> = new Subject();

  public constructor(private readonly router: Router,
                     private readonly userService: UserService,
                     private readonly errorService: ErrorService) {

    const currentUser = localStorage.getItem('JWT_USER');
    if (currentUser) {
      this.loggedInUser = JSON.parse(currentUser);
    }
  }

  public get currentUser() {
    return this.loggedInUser;
  }

  public login(login: UserLoginFormDto): Observable<UserDto> {
    return this.userService.login(login)
      .pipe(
        tap((user) => {
          this.loggedInUser = user;

          localStorage.setItem('JWT_TOKEN', user.token);
          localStorage.setItem('JWT_USER', JSON.stringify(user));
          this.loginUser$.next(this.loggedInUser);
        })
      );
  }

  public logout(url?: string) {
    this.userService.logout(this.loggedInUser).subscribe();

    localStorage.removeItem('JWT_TOKEN');
    localStorage.removeItem('JWT_USER');

    this.loggedInUser = undefined;
    this.router.navigate(['user/login'], { queryParams: { url } }).catch(console.error);
    this.loginUser$.next(this.loggedInUser);
    this.errorService.addSuccessMessage("Вы успешно вышли!");
  }

  public getToken() {
    return localStorage.getItem('JWT_TOKEN');
  }

  public updateLoggedUser(user: Partial<UserDto>) {
    this.loggedInUser = { ...this.loggedInUser, ...user };
    localStorage.setItem('JWT_USER', JSON.stringify(this.loggedInUser));
    this.loginUser$.next(this.loggedInUser);
  }

  public isAuthenticated(): Observable<boolean> {
    if (!this.getToken()) {
      return of(false);
    }
    return this.userService.check();
  }

  public hasRole(roles: RoleEnum | RoleEnum[]): boolean | undefined {
    return Array.isArray(roles)
      ? roles.some((role) => this.currentUser?.roles?.includes(role))
      : this.currentUser?.roles?.includes(roles);
  }

}
