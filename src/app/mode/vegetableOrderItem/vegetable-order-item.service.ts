import { Injectable } from '@angular/core';

@Injectable()
export class VegetableOrderItem {
  id:               string;/*订单详情编号*/
  userId:           string;/*用户ID*/
  productCode:     string;/*净菜id*/
  orderNo:         number;/*订单id*/
  productName:      string;/*净菜名称*/
  imgPath:         string;/*净菜图片*/
  detail:            string;/*净菜详情*/
  unitPrice:         number;/*净菜单价*/
  quantity:          number;/*该净菜购买数量*/
  totalPrice:        string;/*总价*/
  constructor() { }

}
