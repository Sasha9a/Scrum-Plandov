import { Expose } from "class-transformer";

@Expose()
export class ReportBoardSpentSumsDto {

  @Expose()
  public days: Record<string, number>;

  @Expose()
  public weeks: Record<string, number>;

  @Expose()
  public months: Record<string, number>;

}
