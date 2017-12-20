import { Injectable } from '@angular/core';

@Injectable()
export class Welfare {
  /*福利信息实体类*/
  id          : number;           /*id*/
  title       : string;           /*福利信息标题*/
  content     : string;           /*福利内容描述*/
  imgPath     : string;           /*图片地址*/
  targetId    : Array<any>;       /*享受对象*/
  feedBack    : string;           /*是否需要反馈*/
  feedBackMsg : any;              /*需反馈的信息*/
  status      : string;           /*状态*/
  others      : Array<Other>;     /*自定义字段*/
  details     : any;              /*是否反馈*/
}

export class Other {
  key: string;
  value: string;
}
