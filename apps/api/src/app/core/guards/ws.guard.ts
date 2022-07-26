import { CanActivate, Injectable } from "@nestjs/common";
import { UserService } from "@scrum/api/modules/user/user.service";
import { RoleEnum } from "@scrum/shared/enums/role.enum";
import { Observable } from "rxjs";
import jwt from 'jsonwebtoken';
import { environment } from "../../../environments/environment";

@Injectable()
export class WsGuard implements CanActivate {

  public constructor(private userService: UserService) {
  }

  public canActivate(context: any): boolean | any | Promise<boolean> | Observable<boolean> {
    const bearerToken = context.args[0].handshake.headers.authorization;
    try {
      const decoded = jwt.verify(bearerToken, environment.secret) as { user: { _id: string, email: string, roles: RoleEnum[] } };
      return new Promise((resolve, reject) => {
        return this.userService.findByEmail(decoded.user.email).then((user) => {
          if (user) {
            resolve(user);
          } else {
            reject(false);
          }
        });

      });
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }

}
