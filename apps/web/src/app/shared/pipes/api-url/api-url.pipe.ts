import { Pipe, PipeTransform } from '@angular/core';
import { environment } from "../../../../environments/environment";

@Pipe({
  name: 'apiUrl'
})
export class ApiUrlPipe implements PipeTransform {

  public transform(url: string): string {
    return environment.url + '/' + url + '?token=' + localStorage.getItem('JWT_TOKEN');
  }

}
