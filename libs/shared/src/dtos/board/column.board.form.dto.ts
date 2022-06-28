import { Expose } from "class-transformer";
import { IsDefined, IsString, MinLength } from "class-validator";

@Expose()
export class ColumnBoardFormDto {

  @Expose()
  @IsString({ message: "Введите название" })
  @MinLength(2, { message: "Название должно быть длиной от 2 символов" })
  public name: string;

  @Expose()
  @IsDefined({ message: "Введите очередность" })
  public order: number;

  @Expose()
  @IsString({ message: "Выберите цвет" })
  public color: string;

  @Expose()
  @IsString({ message: "Выберите фоновый цвет" })
  public backgroundColor: string;

}
