import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  public transform(bytes: number): string {
    let _bytes: string;
    if (bytes >= 1000000000) {
      _bytes = (bytes / 1000000000).toFixed(2) + ' Гб';
    } else if (bytes >= 1000000) {
      _bytes = (bytes / 1000000).toFixed(2) + ' Мб';
    } else if (bytes >= 1000) {
      _bytes = (bytes / 1000).toFixed(2) + ' Кб';
    } else if (bytes > 1) {
      _bytes = bytes + ' байт(а)';
    } else if (bytes === 1) {
      _bytes = bytes + ' байт';
    } else {
      _bytes = '0 byte';
    }
    return _bytes;
  }

}
