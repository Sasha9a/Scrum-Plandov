import { ErrorHandler, Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {

  public handleError(error: any): void {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
    if (chunkFailedMessage.test(error.message)) {
      const reloadPage = confirm('Доступна новая версия Scrum. Для корректной работы подтвердите перезагрузку страницы');

      if (reloadPage) {
        window.location.reload();
      }
      return;
    }

    console.error(error);
  }

}
