import { VerifyEmailTypeEnum } from "@scrum/shared/enums/verify.email.type.enum";
import { Expose } from "class-transformer";
import { IsDefined, IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";

@Expose()
export class VerifyDto {

  @Expose()
  @IsString({ message: "Введите путь" })
  @MinLength(1, { message: "Введите путь" })
  public path: string;

  @Expose()
  @IsDefined({ message: "Выберите тип" })
  @IsEnum(VerifyEmailTypeEnum)
  public type: VerifyEmailTypeEnum;

  @Expose()
  @IsEmail({ message: "Введите почту" })
  public email: string;

  @Expose()
  @IsOptional()
  public oldEmail?: string;

}
