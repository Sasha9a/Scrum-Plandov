import { Injectable } from '@angular/core';
import { ConfirmationService } from "primeng/api";

interface ConfirmData {
  message?: string;
  icon?: string;
  accept: () => any;
  reject?: () => any;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  public constructor(private readonly confirmationService: ConfirmationService) {}

  public confirm(data: ConfirmData) {
    this.confirmationService.confirm({
      message: data.message || '',
      header: 'Подтверждение действия',
      icon: data.icon || 'pi pi-info-circle',
      acceptLabel: 'Да',
      rejectLabel: 'Нет',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger p-button-text',
      accept: data.accept || (() => null),
      reject: data.reject || (() => null)
    });
  }

}
