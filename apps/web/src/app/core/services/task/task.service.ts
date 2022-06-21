import { Injectable } from '@angular/core';
import { BaseService } from "@scrum/web/core/services/base.service";

@Injectable({
  providedIn: 'root'
})
export class TaskService extends BaseService {
  protected override baseUrl = '/task';
}
