import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinWithChild'
})
export class JoinWithChildPipe implements PipeTransform {

  public transform(array: any[], separator = ', '): string {
    if (!array) {
      return '';
    }
    return this.parser(array).join(separator);
  }

  private parser(obj: any): any[] {
    const array = Array.isArray(obj) ? obj : [obj];
    return array.reduce((acc: any[], value) => {
      if (typeof value === 'object') {
        const fields = Object.keys(value);
        fields.forEach((field) => {
          if (value[field]) {
            acc = acc.concat(this.parser(value[field]));
          }
        });
      } else if (typeof value === 'string') {
        acc = acc.concat(value);
      }
      return acc;
    }, []);
  }

}
