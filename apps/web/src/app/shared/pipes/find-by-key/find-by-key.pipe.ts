import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findByKey'
})
export class FindByKeyPipe implements PipeTransform {

  public transform<T>(array: T[], key: keyof T, search: any): T | null | undefined {
    if (!key || !search) {
      return null;
    }
    return array.find((ar) => ar[key] === search);
  }

}
