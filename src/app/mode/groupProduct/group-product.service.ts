import { Injectable } from '@angular/core';

@Injectable()
export class GroupProduct {
  code:              string;/*商品编号*/
  name:              string;/*商品名称*/
  imgPath:             any;/*商品图片*/
  imgPathList:         string[];/*商品图片*/
  detail:            string;/*商品详情*/
  price:              number;/*商品价格*/
  status:             string;/*商品状态*/
  startTime:          string;/*商品开售时间*/
  endTime:             string;/*商品结束状态*/
  contact:             string;/*联系方式*/
  phone:               string;/*手机*/
  payaccount:          string;/*付款账号*/
  quantity:            string;/*数量*/
  label:                string;/*商品标签*/
  producttype:             string;/*商品类型*/
  shipping:string;/*配送方式*/
  checkStatus: string;
  checkResult:string;



  constructor() { }

}
