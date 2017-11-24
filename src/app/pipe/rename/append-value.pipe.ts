import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appendValue'
})
export class AppendValuePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(typeof (value) === 'undefined' || value === null) {
      return '';
    } else if(value === '') {
      return '';

    } else {
      return value + args;
    }
  }

}
