import { ReportBoardSpentItemDto } from "@scrum/shared/dtos/report/report.board.spent.item.dto";
import { ReportBoardSpentSumsDto } from "@scrum/shared/dtos/report/report.board.spent.sums.dto";
import { Expose, Type } from "class-transformer";

@Expose()
export class ReportBoardSpentDto {

  @Expose()
  @Type(() => ReportBoardSpentItemDto)
  public items: ReportBoardSpentItemDto[];

  @Expose()
  @Type(() => ReportBoardSpentSumsDto)
  public sums: ReportBoardSpentSumsDto;

}
