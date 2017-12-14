import { Injectable } from '@angular/core';
import {GroupOrderItem} from '../groupOrderItem/group-orderItem.service'
@Injectable()
export class GroupOrder {

  id:number;/*订单id*/
  userId:string;/*用户id*/
  payment:number;/*订单金额*/
  status:string;/*订单状态*/
  payTime:string;/*付款时间*/
  closeTime:string;/*订单关闭时间*/
  note:string;
  groupOrderItems:Array<GroupOrderItem>;
  constructor() { }

}
