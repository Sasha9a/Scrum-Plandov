import { Pipe, PipeTransform } from '@angular/core';
import moment from "moment-timezone";

@Pipe({
  name: 'humanRange'
})
export class HumanRangePipe implements PipeTransform {

  public transform(duration: number, unit: moment.unitOfTime.DurationConstructor = 'days'): string {
    return moment.duration(duration, unit).humanize();
  }

}
