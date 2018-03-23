import { Injectable } from '@angular/core';

@Injectable()
export class ShareProduct {
  id          : number; /*主键*/
  name        : string; /*商品名称*/
  status      : string;  /*状态*/
  type        : string; /*商品类型*/
  typeNumber  : string; /*商品不同类型的数量*/
  imgPath     : any;  /*多图实际地址分号隔开*/
  imgPathList : Array<string>; /*多图地址base64*/
  summary     : string; /*文字说明*/
  unitPrice       : number;  /*价格*/
  amount      : number; /*数量*/
  bTime       : string; /*开始时间*/
  eTime       : string; /*结束时间（可选）*/
  targetId    : any;    /*开放范围对象*/
  targetName  : any;
  isCheck     : string; /*审核状态*/
  checkNote   : string; /*审核意见*/
  realNumber  : number; /*实际库存量*/
  createTime  : string; /*创建时间*/
  createUserId: string; /*创建人ID*/
  modifyTime  : string; /*修改时间*/
  modifyUserId: string; /*修改人ID*/
  userId      : string;
  userName    : string;
  telNum      : string;  /*发起者电话*/
  userDeptId  : string;
  userDeptName: string;
  userDept    : string;

  productId   : string;
  productName : string;
  price       : string;
  expireTime     : string;  /*成交时间*/
}
