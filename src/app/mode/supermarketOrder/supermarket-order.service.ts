import { Injectable } from '@angular/core';
import {SupermarketOrderItem} from '../supermarketOrderItem/supermarket-order-item.service'
@Injectable()
export class SupermarketOrder {i

  id:                        number;
  userId:                   string;/*用户*/
  payment:                  number;/*金额*/
  status:                   string;/*订单状态*/
  payTime:                  string;/*付款时间*/
  closeTime:                string;/*订单关闭时间*/
  note:                      string;/*备注*/
  serviceCenter:            string;/*配送中心*/
  orderItems                :Array<SupermarketOrderItem>;
  userName                  : string;
  telPhone                  : string;
  constructor() { }

}
