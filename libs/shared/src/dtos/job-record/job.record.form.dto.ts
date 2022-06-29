import { Expose, Type } from "class-transformer";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";
import { IsDefined, IsOptional, Min } from "class-validator";

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
  @IsDefined({ message: "Введите время" })
  @Min(1, { message: "Минимум кол-во часов должно быть от 1" })
  public timeWork: number;

}
