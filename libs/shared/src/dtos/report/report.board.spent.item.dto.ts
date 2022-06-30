import { SprintDto } from "@scrum/shared/dtos/sprint/sprint.dto";
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { Expose, Type } from "class-transformer";

@Expose()
export class ReportBoardSpentItemDto {

  @Expose()
  public date: Date;

  @Expose()
  @Type(() => UserDto)
  public user: UserDto;

  @Expose()
  @Type(() => TaskDto)
  public task: TaskDto;

  @Expose()
  @Type(() => SprintDto)
  public sprint: SprintDto;

  @Expose()
  public spent: number;

}
