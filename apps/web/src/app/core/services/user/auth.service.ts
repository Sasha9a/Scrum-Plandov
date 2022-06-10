import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { UserLoginFormDto } from "@scrum/shared/dtos/user/user.login.form.dto";
import { RoleEnum } from "@scrum/shared/enums/role.enum";
import { UserService } from "@scrum/web/core/services/user/user.service";
import { Observable, of, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInUser: Partial<UserDto> | undefined;

  public constructor(private readonly router: Router,
                     private readonly userService: UserService) {

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
        })
      );
  }

  public logout(url?: string) {
    localStorage.removeItem('JWT_TOKEN');
    localStorage.removeItem('JWT_USER');

    this.loggedInUser = undefined;
    this.router.navigate(['/login'], { queryParams: { url } }).catch(console.error);
  }

  public getToken() {
    return localStorage.getItem('JWT_TOKEN');
  }

  public updateLoggedUser(user: Partial<UserDto>) {
    this.loggedInUser = { ...this.loggedInUser, ...user };
    localStorage.setItem('JWT_USER', JSON.stringify(this.loggedInUser));
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
