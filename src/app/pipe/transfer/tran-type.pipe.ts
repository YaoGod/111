import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tranType'
})
export class TranTypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value === 'build'){
      return '自建';
    }
    else if(value === 'buy'){
      return '自购';
    }
    else if(value === 'lease'){
      return '租赁';
    }
    return null;
  }

}
