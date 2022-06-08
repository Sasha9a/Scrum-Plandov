import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@scrum/shared/schemas/user.schema";

@Injectable()
export class AuthService {

  public constructor(private readonly jwtService: JwtService) {
  }

  public async login(user: User): Promise<{ accessToken: string }> {
    const payload = { user: { _id: user._id, email: user.email, roles: user.roles } };
    return {
      accessToken: this.jwtService.sign(payload)
    };
  }

}
