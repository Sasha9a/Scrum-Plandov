import { Pipe, PipeTransform } from '@angular/core';
import moment from "moment-timezone";

@Pipe({
  name: 'timeFromNow'
})
export class TimeFromNowPipe implements PipeTransform {

  public transform(date: Date, unit: 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' = 'days'): number {
    return moment(date).diff(moment(), unit);
  }

}
