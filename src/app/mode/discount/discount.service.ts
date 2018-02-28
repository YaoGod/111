import { Injectable } from '@angular/core';

@Injectable()
export class Discount {

  /*优惠信息实体类*/
  id          : number;  /*id*/
  title       : string;  /*优惠信息标题*/
  summary     : string;  /*优惠信息内容描述*/
  imgPath     : string;  /*图片地址*/
  effectBtime : string;  /*有效期开始时间*/
  effectEtime : string;  /*有效期结束时间*/
  status      : string;  /*状态*/
  others      : Array<Other>;     /*自定义字段*/
  filePath    : Array<string>; /*附件地址*/
  fileName    : Array<string>; /*附件名称*/
}

export class Other {
  key: string;
  value: string;
}
