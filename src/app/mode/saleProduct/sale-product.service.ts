import { Injectable } from '@angular/core';

@Injectable()
export class SaleProduct {
  id          : string; /*主键*/
  name        : string; /*商品名称*/
  type        : string; /*商品类型*/
  typeNumber  : string; /*商品不同类型的数量*/
  imgPath     : any;  /*多图实际地址分号隔开*/
  imgPathList : Array<string>; /*多图地址base64*/
  summary     : string; /*文字说明*/
  price       : number;  /*价格*/
  maxNumber   : number; /*抢购数量*/
  beginTime   : string; /*开始时间*/
  endTime     : string; /*结束时间（可选）*/
  targetId      : any; /*抢购对象*/
  targetName  : any;
  isCheck     : string; /*审核状态*/
  checkNote   : string; /*审核意见*/
  realNumber  : number; /*实际库存量*/
  productName : string;
}

export class UserSale {
  productId  : string;  /*商品ID*/
  productName: string;
  productType: string;  /*选择的类型*/
  amount     : number;  /*数量*/
  total      : number;  /*总价*/
  note       : string;  /*备注*/
  userId     : string;
  userName   : string;  /*员工姓名*/
  deptName   : string;  /*部门*/
  telNumber  : string;   /*电话*/
  address    : string;  /*地址*/
  createTime : string;   /*下单时间*/
  payTime    : string;
}

export class OrderSale {
  id: string;
  userName: string;
  telNumber: string;
  address: string;
  note: string;
  batch: string;
  payTime : string;
  sendTime: string;
  createTime: string;
  status:string;
  productId: number;
  productName: string;
  productType: string;
  imgPath: string;
  imgPathList:string;
  amount: number;
  total:number;
}
