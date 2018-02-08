import { Injectable } from '@angular/core';

@Injectable()
export class SupermarketProduct {
  code:              string;/*商品编号*/
  supplierId:       string;/*经销商id*/
  sname:              string;/*商品名称*/
  imgPath:             string;/*商品图片*/
  detail:            string;/*商品详情*/
  price:              number;/*商品价格*/
  stype:              string;/*商品分类*/
  pstatus:             string;/*商品状态*/
  leftstatus:          string;/*库存状态*/
  id:number;
  applier:string;
  category:string;


  constructor() { }

}
