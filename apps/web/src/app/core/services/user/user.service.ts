import { Injectable } from '@angular/core';
import { RecoveryFormDto } from "@scrum/shared/dtos/recovery/recovery.form.dto";
import { RecoveryPasswordFormDto } from "@scrum/shared/dtos/recovery/recovery.password.form.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { UserLoginFormDto } from "@scrum/shared/dtos/user/user.login.form.dto";
import { UserPasswordFormDto } from "@scrum/shared/dtos/user/user.password.form.dto";
import { BaseService } from "@scrum/web/core/services/base.service";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  protected override baseUrl = '/user';

  public login(login: UserLoginFormDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.baseUrl}/login`, login);
  }

  public check(): Observable<boolean> {
    return this.http.get(`${this.baseUrl}/check`)
      .pipe(
        map(() => true)
      );
  }

  public checkEmail(query: { email: string }): Observable<{ isBusy: boolean }> {
    return this.http.get<{ isBusy: boolean }>(`${this.baseUrl}/check-email`, { params: query });
  }

  public checkLogin(query: { login: string, _id?: string }): Observable<{ isBusy: boolean }> {
    return this.http.get<{ isBusy: boolean }>(`${this.baseUrl}/check-login`, { params: query });
  }

  public recovery(body: RecoveryFormDto): Observable<null> {
    return this.http.post<null>(`${this.baseUrl}/recovery`, body);
  }

  public recoveryPassword(body: RecoveryPasswordFormDto): Observable<null> {
    return this.http.post<null>(`${this.baseUrl}/recovery-password`, body);
  }

  public changePassword(body: UserPasswordFormDto): Observable<null> {
    return this.http.post<null>(`${this.baseUrl}/change-password`, body);
  }

  public logout(body: Partial<UserDto>): Observable<null> {
    return this.http.post<null>(`${this.baseUrl}/logout`, body);
  }

}
