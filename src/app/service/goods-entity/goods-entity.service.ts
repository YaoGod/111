import { Injectable } from '@angular/core';


@Injectable()
export class GoodsCart {
  productId:number;
  id:number;
  userId: string;
  name: string;
  image: string;
  price:number;
  quantity:number;
  checked: string;
  detail: string;
  totalPrice:number;
  serviceCenter:string;
  constructor() { }

}

@Injectable()
export class Goods{
  id:                number;
  code:              string;/*商品编号*/
  name:             string;/*商品名称*/
  image:            string;/*商品图片*/
  detail:            string;/*商品详情*/
  price:             number;/*商品价格*/
  status:            string;/*商品状态*/
  constructor() { }
}

