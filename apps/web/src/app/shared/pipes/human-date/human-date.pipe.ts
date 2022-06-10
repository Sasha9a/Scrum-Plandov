import { Pipe, PipeTransform } from '@angular/core';
import moment from "moment-timezone";

@Pipe({
  name: 'humanDate'
})
export class HumanDatePipe implements PipeTransform {

  public transform(date: Date): string {
    return moment(date).tz('Europe/Moscow').calendar();
  }

}
