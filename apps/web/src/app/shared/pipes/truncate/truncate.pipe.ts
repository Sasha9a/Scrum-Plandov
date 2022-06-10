import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  public transform(value: string, limit = 25, completeWords = false, ellipsis = '...') {
    if (!value || !limit) {
      return value;
    }

    let _limit = limit;
    let _ellipsis = ellipsis;
    if (completeWords) {
      _limit = value.substring(0, 13).lastIndexOf(' ');
    }
    if (value.substring(0, _limit).length >= value.length) {
      _ellipsis = '';
    }
    return `${value.substring(0, _limit)}${_ellipsis}`;
  }

}
