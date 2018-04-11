import {Pipe, PipeTransform, SecurityContext} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
  name: 'formatSpace'
})
export class FormatSpacePipe implements PipeTransform {

  constructor(private sanitizer:DomSanitizer){}
  transform(value: any, args?: any): any {
    if(typeof (value)!=="undefined" && value!== null){
      let newValue = (value+"")
        .replace(/\\n/g, '<br/>')
        .replace(/ /g,"&nbsp;")
        .replace(/\n/g,"<br/>")
        .replace(/\s/g,"&nbsp;");
      return this.sanitizer.bypassSecurityTrustHtml(newValue);
    }
    return null;
  }

}
