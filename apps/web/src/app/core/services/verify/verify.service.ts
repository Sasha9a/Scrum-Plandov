import { Injectable } from '@angular/core';
import { VerifyDto } from "@scrum/shared/dtos/verify/verify.dto";
import { BaseService } from "@scrum/web/core/services/base.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VerifyService extends BaseService {
  protected override baseUrl = '/verify';

  public findByPath(path: string): Observable<VerifyDto> {
    return this.http.get<VerifyDto>(`${this.baseUrl}/${path}`);
  }

}
