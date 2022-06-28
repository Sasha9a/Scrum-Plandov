import { BaseDto } from "@scrum/shared/dtos/base.dto";
import { Expose } from "class-transformer";

@Expose()
export class ColumnBoardDto extends BaseDto {

  @Expose()
  public name: string;

  @Expose()
  public order: number;

  @Expose()
  public color: string;

  @Expose()
  public backgroundColor: string;

}
