import { UserPasswordFormDto } from "@scrum/shared/dtos/user/user.password.form.dto";
import { Expose } from "class-transformer";
import { IsString, MinLength } from "class-validator";

@Expose()
export class RecoveryPasswordFormDto extends UserPasswordFormDto {

  @Expose()
  @IsString({ message: "Введите путь" })
  @MinLength(1, { message: "Введите путь" })
  public path: string;

}
