import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatSpace'
})
export class FormatSpacePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(typeof (value)!=="undefined" && value!== null){
      let newValue = (value+"").replace(/\\r/g, '<br/>').replace(/ /g,"&nbsp;&nbsp;");
      return newValue;
    }
    return null;
  }

}
