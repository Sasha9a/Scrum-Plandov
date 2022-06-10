import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nestedProperty'
})
export class NestedPropertyPipe implements PipeTransform {

  public transform(item: any, optionsLabel: string = ''): string {
    return optionsLabel
      .split('.')
      .reduce((value, key) => value[key] ?? '', item);
  }

}
