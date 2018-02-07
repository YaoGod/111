import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'imgsafeurl'
})
export class ImgsafeurlPipe implements PipeTransform {
  constructor(private sanitizer:DomSanitizer){}
  transform(html) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(html);
  }


}
