import { BaseDto } from "@scrum/shared/dtos/base.dto";
import { FileDto } from "@scrum/shared/dtos/file.dto";
import { RoleEnum } from "@scrum/shared/enums/role.enum";
import { Expose, Type } from "class-transformer";

@Expose()
export class UserDto extends BaseDto {

  @Expose()
  public email: string;

  @Expose()
  public registerDate: Date;

  @Expose()
  public lastEntranceDate: Date;

  @Expose()
  public login: string;

  @Expose()
  public name: string;

  @Expose()
  public password: string;

  @Expose()
  public roles: RoleEnum[];

  @Expose()
  @Type(() => FileDto)
  public avatar: FileDto;

  @Expose()
  public isValidatedEmail: boolean;

  @Expose()
  public token: string;

}
