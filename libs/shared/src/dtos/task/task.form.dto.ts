import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { ColumnBoardDto } from "@scrum/shared/dtos/board/column.board.dto";
import { FileDto } from "@scrum/shared/dtos/file.dto";
import { SprintDto } from "@scrum/shared/dtos/sprint/sprint.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { TaskPriorityEnum } from "@scrum/shared/enums/task.priority.enum";
import { Expose, Type } from "class-transformer";
import { IsDefined, IsEnum, IsOptional, IsString, Length } from "class-validator";

@Expose()
export class TaskFormDto {

  @Expose()
  @IsOptional()
  public number?: number;

  @Expose()
  @IsString({ message: "Введите название" })
  @Length(3, 200, { message: "Кол-во символов должно быть от 3 до 200" })
  public name: string;

  @Expose()
  @IsDefined({ message: "Не выбрана доска" })
  @Type(() => BoardDto)
  public board: BoardDto;

  @Expose()
  @IsOptional()
  @Type(() => ColumnBoardDto)
  public status?: ColumnBoardDto;

  @Expose()
  @IsOptional()
  @Type(() => UserDto)
  public createdUser?: UserDto;

  @Expose()
  @IsOptional()
  @Type(() => UserDto)
  public executor?: UserDto;

  @Expose()
  @IsOptional()
  @Type(() => SprintDto)
  public sprint?: SprintDto;

  @Expose()
  @IsOptional()
  public updateDate?: Date;

  @Expose()
  @IsEnum(TaskPriorityEnum, { message: "Не выбран приоритет" })
  public priority: TaskPriorityEnum = TaskPriorityEnum.AVERAGE;

  @Expose()
  @IsOptional()
  @Type(() => FileDto)
  public files?: FileDto[];

  @Expose()
  @IsOptional()
  public grade?: number;

  @Expose()
  @IsOptional()
  public left?: number;

  @Expose()
  @IsOptional()
  public spent?: number;

  @Expose()
  @IsOptional()
  public description?: string;

}
