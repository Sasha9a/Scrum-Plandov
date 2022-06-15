import { FileDto } from "@scrum/shared/dtos/file.dto";
import { Expose, Type } from "class-transformer";
import { IsOptional, IsString, MinLength } from "class-validator";

@Expose()
export class UserEditFormDto {

  @Expose()
  @IsString({ message: "Введите логин" })
  @MinLength(5, { message: "Логин должен быть длиной от 5 символов" })
  public login: string;

  @Expose()
  @IsOptional()
  public name?: string;

  @Expose()
  @IsOptional()
  @Type(() => FileDto)
  public avatar?: FileDto;

}
