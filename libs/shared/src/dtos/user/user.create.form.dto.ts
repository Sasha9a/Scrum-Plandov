import { Expose, Transform } from "class-transformer";
import { IsEmail, IsOptional, IsString, Length } from "class-validator";

@Expose()
export class UserCreateFormDto {

  @Expose()
  @IsEmail({}, { message: "Невалидный email" })
  @Transform((element) => element.value?.toLowerCase())
  public email: string;

  @Expose()
  @IsOptional()
  public login?: string;

  @Expose()
  @IsOptional()
  public name?: string;

  @Expose()
  @IsString({ message: "Введите пароль" })
  @Length(8, 25, { message: "Пароль должен состоять от 8 до 25 символов" })
  public password: string;

}
