import { Injectable } from '@angular/core';
import { MessageService } from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  public constructor(private messageService: MessageService) {
  }

  public addCustomError(title = 'Ошибка', description = '', life = 10000) {
    this.messageService.add({ key: 'message', severity: 'error', summary: title, detail: description, life });
  }

  public addDefaultError(error: any, title = 'Ошибка') {
    if (error.error?.statusCode === 403) {
      return this.messageService.add({ key: 'message', severity: 'error', summary: title, detail: 'Отказано в доступе', life: 10000 });
    }

    const description = error.error?.message || error.message || error.detail || '';

    if (typeof description === 'string') {
      return this.messageService.add({ key: 'message', severity: 'error', summary: title, detail: description, life: 10000 });
    } else if (Array.isArray(description)) {
      description.forEach((item) => {
        if (typeof item === 'string') {
          return this.messageService.add({ key: 'message', severity: 'error', summary: title, detail: item, life: 10000 });
        }
      });
    }
  }

  public addSuccessMessage(title: string = 'ОК', description: string = '', life = 10000) {
    this.messageService.add({ key: 'message', severity: 'success', summary: title, detail: description, life });
  }

}
