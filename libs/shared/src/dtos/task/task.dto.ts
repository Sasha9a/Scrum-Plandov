import { BaseDto } from "@scrum/shared/dtos/base.dto";
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { ColumnBoardDto } from "@scrum/shared/dtos/board/column.board.dto";
import { FileDto } from "@scrum/shared/dtos/file.dto";
import { SprintDto } from "@scrum/shared/dtos/sprint/sprint.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { TaskPriorityEnum } from "@scrum/shared/enums/task.priority.enum";
import { Expose, Type } from "class-transformer";

@Expose()
export class TaskDto extends BaseDto {

  @Expose()
  public number: number;

  @Expose()
  public name: string;

  @Expose()
  @Type(() => BoardDto)
  public board: BoardDto;

  @Expose()
  @Type(() => ColumnBoardDto)
  public status: ColumnBoardDto;

  @Expose()
  @Type(() => UserDto)
  public createdUser: UserDto;

  @Expose()
  @Type(() => UserDto)
  public executor: UserDto;

  @Expose()
  @Type(() => SprintDto)
  public sprint: SprintDto;

  @Expose()
  public createDate: Date;

  @Expose()
  public updateDate: Date;

  @Expose()
  public priority: TaskPriorityEnum;

  @Expose()
  @Type(() => FileDto)
  public files: FileDto[];

  @Expose()
  public grade: number;

  @Expose()
  public left: number;

  @Expose()
  public spent: number;

  @Expose()
  public description: string;

}
