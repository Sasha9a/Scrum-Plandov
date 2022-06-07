import { FileDto } from "@scrum/shared/dtos/file.dto";
import { Expose, Type } from "class-transformer";
import { IsOptional } from "class-validator";

@Expose()
export class UserEditFormDto {

  @Expose()
  @IsOptional()
  public login?: string;

  @Expose()
  @IsOptional()
  public name?: string;

  @Expose()
  @IsOptional()
  @Type(() => FileDto)
  public avatar?: FileDto;

}
