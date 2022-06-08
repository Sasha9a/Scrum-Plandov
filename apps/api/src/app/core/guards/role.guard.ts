import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "@scrum/api/core/decorators/role.decorator";
import { UserService } from "@scrum/api/modules/user/user.service";
import { RoleEnum } from "@scrum/shared/enums/role.enum";

@Injectable()
export class RoleGuard implements CanActivate {

  public constructor(private readonly reflector: Reflector,
                     private readonly userService: UserService) {
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }
    const verifyUser = await this.userService.findById(user._id);
    if (!verifyUser) {
      return false;
    }
    return requiredRoles.some((role) => verifyUser.roles?.includes(role));
  }
}
