import { BaseDto } from "@scrum/shared/dtos/base.dto";
import { ColumnBoardDto } from "@scrum/shared/dtos/board/column.board.dto";
import { SprintDto } from "@scrum/shared/dtos/sprint/sprint.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { Expose, Type } from "class-transformer";

@Expose()
export class BoardDto extends BaseDto {

  @Expose()
  public name: string;

  @Expose()
  public code: string;

  @Expose()
  public indexTaskNumber: number;

  @Expose()
  @Type(() => SprintDto)
  public activeSprints: SprintDto[];

  @Expose()
  public createDate: Date;

  @Expose()
  @Type(() => UserDto)
  public createdUser: UserDto;

  @Expose()
  @Type(() => UserDto)
  public users: UserDto[];

  @Expose()
  @Type(() => ColumnBoardDto)
  public columns: ColumnBoardDto[];

}
