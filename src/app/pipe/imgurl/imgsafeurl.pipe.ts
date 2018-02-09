import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'imgsafeurl'
})
export class ImgsafeurlPipe implements PipeTransform {
  constructor(private sanitizer:DomSanitizer){}
  transform(html, args?: any): any {
    if(args){
      /*带参数的情况，主要用于编辑和新增中的图片地址*/
      if(args.length>0){
        return  this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(args[0]));
      }else if(html.indexOf("/")===0){
        return "../assets/image/icon_img.png";
      }
    }
    if(html&&html.indexOf("/")===0){
      /*图片地址错误未转换的*/
      return "../assets/image/icon_img.png";
    }
    if(typeof(html)==="undefined"){
      return "../assets/image/icon_img.png";
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(html);
  }
}
