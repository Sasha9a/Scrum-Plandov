import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { JwtAuthGuard } from "@scrum/api/core/guards/jwt-auth.guard";
import { RoleGuard } from "@scrum/api/core/guards/role.guard";
import { AuthService } from "@scrum/api/modules/user/auth.service";
import { JwtStrategy } from "@scrum/api/modules/user/jwt.strategy";
import { UserController } from "@scrum/api/modules/user/user.controller";
import { UserService } from "@scrum/api/modules/user/user.service";
import { VerifyModule } from "@scrum/api/modules/verify/verify.module";
import { User, UserSchema } from "@scrum/shared/schemas/user.schema";
import { environment } from "../../../environments/environment";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: true
    }),
    JwtModule.register({
      secret: environment.secret,
      signOptions: {
        expiresIn: environment.expiresIn
      }
    }),
    VerifyModule
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, JwtStrategy, JwtAuthGuard, RoleGuard],
  exports: [UserService, AuthService]
})
export class UserModule {}
