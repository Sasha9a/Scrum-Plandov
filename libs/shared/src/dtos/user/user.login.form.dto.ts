import { Expose } from "class-transformer";
import { IsString, MinLength } from "class-validator";

@Expose()
export class UserLoginFormDto {

  @Expose()
  @IsString({ message: "Введите почту" })
  @MinLength(1, { message: "Введите почту" })
  public email: string;

  @Expose()
  @IsString({ message: "Введите пароль" })
  @MinLength(1, { message: "Введите пароль" })
  public password: string;

}
