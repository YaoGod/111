import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minLength'
})
export class MinLengthPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(typeof (args[0]) !== "undefined" && args[0] !== null){
      if(value.length>args[0]){
        return value.slice(0,args[0]) +args[1];
      }else{
        return value;
      }
    }else{
      return value.slice(0,10) + '..';
    }
  }

}
