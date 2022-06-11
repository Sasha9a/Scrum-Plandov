import { Expose, Transform } from "class-transformer";
import { IsEmail, IsOptional, IsString, Length, MinLength } from "class-validator";

@Expose()
export class UserCreateFormDto {

  @Expose()
  @IsEmail({}, { message: "Невалидный email" })
  @Transform((element) => element.value?.toLowerCase())
  public email: string;

  @Expose()
  @IsString({ message: "Введите логин" })
  @MinLength(5, { message: "Логин должен быть длиной от 5 символов" })
  public login: string;

  @Expose()
  @IsOptional()
  public name?: string;

  @Expose()
  @IsString({ message: "Введите пароль" })
  @Length(8, 32, { message: "Пароль должен состоять от 8 до 32 символов" })
  public password: string;

}
