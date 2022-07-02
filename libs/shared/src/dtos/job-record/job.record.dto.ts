import { Expose, Type } from "class-transformer";
import { BaseDto } from "@scrum/shared/dtos/base.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { SprintDto } from "@scrum/shared/dtos/sprint/sprint.dto";

@Expose()
export class JobRecordDto extends BaseDto {

  @Expose()
  @Type(() => UserDto)
  public user: UserDto;

  @Expose()
  @Type(() => TaskDto)
  public task: TaskDto;

  @Expose()
  @Type(() => BoardDto)
  public board: BoardDto;

  @Expose()
  @Type(() => SprintDto)
  public sprint: SprintDto;

  @Expose()
  public date: Date;

  @Expose()
  public timeWork: number;

}
