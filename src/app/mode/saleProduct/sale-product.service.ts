import { Injectable } from '@angular/core';

@Injectable()
export class SaleProduct {
  id          : number; /*主键*/
  name        : string; /*商品名称*/
  type        : string; /*商品类型*/
  imgPath     : any;  /*多图实际地址分号隔开*/
  imgPathList : Array<string>; /*多图地址base64*/
  summary     : string; /*文字说明*/
  price       : string;  /*价格*/
  maxNumber   : string; /*抢购数量*/
  beginTime   : string; /*开始时间*/
  endTime     : string; /*结束时间（可选）*/
  deptId      : Array<string>; /*抢购对象*/
  deptName    : Array<string>;
  isCheck     : string; /*审核状态*/

}
