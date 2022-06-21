import { SprintDto } from "@scrum/shared/dtos/sprint/sprint.dto";
import { SprintWorkUserInfoDto } from "@scrum/shared/dtos/sprint/sprint.work.user.info.dto";
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";
import { Expose, Type } from "class-transformer";

@Expose()
export class SprintTasksInfoDto {

  @Expose()
  @Type(() => SprintDto)
  public sprint?: SprintDto;

  @Expose()
  @Type(() => TaskDto)
  public tasks: TaskDto[];

  @Expose()
  @Type(() => SprintWorkUserInfoDto)
  public notAssignedInfo?: SprintWorkUserInfoDto;

  @Expose()
  @Type(() => SprintWorkUserInfoDto)
  public usersInfo?: SprintWorkUserInfoDto[];

  @Expose()
  @Type(() => SprintWorkUserInfoDto)
  public sumInfo?: SprintWorkUserInfoDto;

}
