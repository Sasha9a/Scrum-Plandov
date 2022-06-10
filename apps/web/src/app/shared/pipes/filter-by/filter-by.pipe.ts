import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {

  public transform<T>(arr: T[], key: keyof T, positive = true): Array<T> {
    return arr.filter((item) => positive ? item[key] : !item[key]);
  }

}
