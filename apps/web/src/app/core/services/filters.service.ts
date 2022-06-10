import { Injectable } from '@angular/core';
import moment from "moment-timezone";

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  public formatISOPeriod(dates: [Date, Date], storageName?: string): [Date, Date] {
    const from = moment(dates[0]).format('YYYY-MM-DD');
    const to = moment(dates[1]).format('YYYY-MM-DD');

    if (storageName) {
      localStorage.setItem(`${storageName}.from`, from);
      localStorage.setItem(`${storageName}.to`, to);
    }

    return [from as unknown as Date, to as unknown as Date];
  }

}
