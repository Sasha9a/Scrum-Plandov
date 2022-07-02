import { Expose } from "class-transformer";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";

@Expose()
export class ReportBoardSpentSumsDto {

  @Expose()
  public usersInfo: { user: UserDto, spent: number }[];

}
