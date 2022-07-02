import { Expose, Type } from "class-transformer";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";
import { IsDefined, IsOptional, Min } from "class-validator";
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { SprintDto } from "@scrum/shared/dtos/sprint/sprint.dto";

@Expose()
export class JobRecordFormDto {

  @Expose()
  @IsOptional()
  @Type(() => UserDto)
  public user?: UserDto;

  @Expose()
  @IsDefined({ message: "Не выбрана задача" })
  @Type(() => TaskDto)
  public task: TaskDto;

  @Expose()
  @IsDefined({ message: "Не выбрана доска" })
  @Type(() => BoardDto)
  public board: BoardDto;

  @Expose()
  @IsDefined({ message: "Не выбран спринт" })
  @Type(() => SprintDto)
  public sprint: SprintDto;

  @Expose()
  @IsDefined({ message: "Введите время" })
  @Min(1, { message: "Минимум кол-во часов должно быть от 1" })
  public timeWork: number;

}
