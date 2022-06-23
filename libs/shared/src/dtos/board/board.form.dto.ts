import { ColumnBoardFormDto } from "@scrum/shared/dtos/board/column.board.form.dto";
import { SprintDto } from "@scrum/shared/dtos/sprint/sprint.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { Expose, Type } from "class-transformer";
import { ArrayMinSize, IsOptional, IsString, Length, MinLength, ValidateNested } from "class-validator";

@Expose()
export class BoardFormDto {

  @Expose()
  @IsString({ message: "Введите название" })
  @MinLength(5, { message: "Название должно быть длиной от 5 символов" })
  public name: string;

  @Expose()
  @IsString({ message: "Введите код" })
  @Length(2, 5, { message: "Код должен быть длиной от 2 до 5 символов" })
  public code: string;

  @Expose()
  @IsOptional()
  @Type(() => SprintDto)
  public activeSprints?: SprintDto[];

  @Expose()
  @IsOptional()
  @Type(() => UserDto)
  public createdUser?: UserDto;

  @Expose()
  @IsOptional()
  @Type(() => UserDto)
  public users?: UserDto[];

  @Expose()
  @ArrayMinSize(1, { message: "Минимальное кол-во столбцов должно быть от 1 шт" })
  @ValidateNested()
  @Type(() => ColumnBoardFormDto)
  public columns: ColumnBoardFormDto[];

}
