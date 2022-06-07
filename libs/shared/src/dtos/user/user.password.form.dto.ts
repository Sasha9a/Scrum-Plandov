import { Expose } from "class-transformer";
import { IsString, Length } from "class-validator";

@Expose()
export class UserPasswordFormDto {

  @Expose()
  @IsString({ message: "Введите пароль" })
  @Length(8, 25, { message: "Пароль должен состоять от 8 до 25 символов" })
  public password: string;

  @Expose()
  @IsString({ message: "Введите пароль" })
  @Length(8, 25, { message: "Пароль должен состоять от 8 до 25 символов" })
  public repeatPassword: string;

}
