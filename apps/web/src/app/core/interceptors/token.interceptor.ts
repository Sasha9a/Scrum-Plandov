import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "@scrum/web/core/services/user/auth.service";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  public constructor(private readonly authService: AuthService) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const currentUser = this.authService.currentUser;

    if (currentUser && token) {
      const modifiedReq = req.clone({ withCredentials: true, url: environment.url + req.url, headers: req.headers.set('Authorization', 'Bearer ' + token) });
      return next.handle(modifiedReq);
    } else {
      return next.handle(req.clone({ url: environment.url + req.url }));
    }
  }

}
