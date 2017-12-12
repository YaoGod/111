import { Injectable } from '@angular/core';

@Injectable()
export class GroupOrderItem{
  id:               string;/*订单详情编号*/
  userId:           string;/*用户ID*/
  productCode:     string;/*商品id*/
  orderNo:         number;/*订单id*/
  productName:      string;/*商品名称*/
  imagePath:         string;/*商品图片*/
  detail:            string;/*商品详情*/
  unitPrice:         number;/*商品单价*/
  quantity:          number;/*该商品购买数量*/
  totalPrice:        string;/*总价*/
  status:             string;/*商品状态*/

  constructor() { }

}



