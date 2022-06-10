import { Injectable } from '@angular/core';
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { UserLoginFormDto } from "@scrum/shared/dtos/user/user.login.form.dto";
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

  public logout(body: UserDto): Observable<null> {
    return this.http.post<null>(`${this.baseUrl}/logout`, body);
  }

}
