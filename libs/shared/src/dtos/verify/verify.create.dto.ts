import { VerifyEmailTypeEnum } from "@scrum/shared/enums/verify.email.type.enum";
import { Expose } from "class-transformer";
import { IsEmail, IsOptional } from "class-validator";

@Expose()
export class VerifyCreateDto {

  @Expose()
  @IsOptional()
  public path?: string;

  @Expose()
  public type?: VerifyEmailTypeEnum;

  @Expose()
  @IsEmail({ message: "Введите почту" })
  public email: string;

  @Expose()
  @IsOptional()
  public oldEmail?: string;

}
