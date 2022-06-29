import { Injectable } from '@angular/core';
import { BaseService } from "@scrum/web/core/services/base.service";

@Injectable({
  providedIn: 'root'
})
export class JobRecordService extends BaseService {
  protected override baseUrl = '/job-record';
}
