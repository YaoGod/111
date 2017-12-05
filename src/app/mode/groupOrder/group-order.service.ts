import { Injectable } from '@angular/core';

@Injectable()
export class GroupOrderService {
  id:              string;/*订单编号*/
  userId:          string;/*用户ID*/
  name:              string;/*商品名称*/
  image:             string;/*商品图片*/
  detail:            string;/*商品详情*/
  price:              number;/*商品价格*/
  status:             string;/*商品状态*/
  startTime:          string;/*商品开售时间*/
  endTime:             string;/*商品结束状态*/
  contact:             string;/*联系方式*/
  phone:               string;/*手机*/
  payaccount:          string;/*付款账号*/
  label:                string;/*商品标签*/
  producttype:             string;/*商品类型*/
  constructor() { }

}



