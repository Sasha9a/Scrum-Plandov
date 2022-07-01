import { Injectable } from '@angular/core';
import { ReportBoardQueryParamsDto } from "@scrum/shared/dtos/report/report.board.query.params.dto";
import { ReportBoardSpentDto } from "@scrum/shared/dtos/report/report.board.spent.dto";
import { BaseService } from "@scrum/web/core/services/base.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService {
  protected override baseUrl = '/report';

  public spent(queryParams: ReportBoardQueryParamsDto): Observable<ReportBoardSpentDto> {
    return this.http.get<ReportBoardSpentDto>(`${this.baseUrl}/spent`, { params: queryParams as any });
  }

}
