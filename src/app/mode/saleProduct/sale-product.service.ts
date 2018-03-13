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
  maxNumber   : number; /*抢购数量*/
  beginTime   : string; /*开始时间*/
  endTime     : string; /*结束时间（可选）*/
  targetId      : any; /*抢购对象*/
  targetName  : any;
  isCheck     : string; /*审核状态*/
  checkNote   : string; /*审核意见*/
  realNumber  : number; /*实际库存量*/
}

export class UserSale {
  productId  : number;  /*商品ID*/
  amount     : number;  /*数量*/
  total      : number;  /*总价*/
  note       : string;  /*备注*/
  userName   : string;
  telNumber  : string;
  address    : string;
}