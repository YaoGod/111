import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'imgsafeurl'
})
export class ImgsafeurlPipe implements PipeTransform {
  constructor(private sanitizer:DomSanitizer){}
  transform(html, args?: any): any {
    if(args&&args.length>0){
      return  this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(args[0]));
    }
    if(html.indexOf("data:")===0){
      return this.sanitizer.bypassSecurityTrustResourceUrl(html);
    }
    return;
  }
}
