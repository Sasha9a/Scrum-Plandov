import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { Expose, Type } from "class-transformer";
import { IsDefined, IsOptional, IsString, Length } from "class-validator";

@Expose()
export class SprintFormDto {

  @Expose()
  @IsString({ message: "Введите название" })
  @Length(3, 200, { message: "Кол-во символов должно быть от 3 до 200" })
  public name: string;

  @Expose()
  @IsDefined({ message: "Выберите доску" })
  @Type(() => BoardDto)
  public board: BoardDto;

  @Expose()
  @IsOptional()
  public startDate?: Date;

  @Expose()
  @IsOptional()
  public endDate?: Date;

  @Expose()
  @IsOptional()
  public isCompleted?: boolean;

}
