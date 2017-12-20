import { Injectable } from '@angular/core';
import {VegetableOrderItem} from '../../mode/vegetableOrderItem/vegetable-order-item.service'
@Injectable()
export class VegetableOrder {
  id:number;/*订单id*/
  userId:string;/*用户id*/
  payment:number;/*订单金额*/
  status:string;/*订单状态*/
  payTime:string;/*付款时间*/
  closeTime:string;/*订单关闭时间*/
  note:string;
  vegetableOrderItems:Array<VegetableOrderItem>;
  serviceCenter:string;
  constructor() { }

}
