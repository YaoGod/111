import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyValue'
})
export class EmptyValuePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(typeof (value) === 'undefined' || value === null) {
      return args;
    } else if(value === '') {
      return value;

    } else {
      return value;
    }
  }

}
