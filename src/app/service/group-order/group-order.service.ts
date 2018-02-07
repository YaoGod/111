import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {isUndefined} from "util";
import {until} from "selenium-webdriver";
import titleContains = until.titleContains;
import { IpSettingService } from '../ip-setting/ip-setting.service';

@Injectable()
export class GroupOrderService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true
  });
  constructor(
    private http: Http,
    private ipSetting  : IpSettingService
  ) { };

  getOrderList() {
    let url = this.ipSetting.ip + '/mmall/order/getOrderList/null';
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  getOrderItems(orderId) {
    let url = this.ipSetting.ip + '/mmall/order/getOrderItems/'+orderId;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }


  getOrderAllList(productName,orderId,productId,pageNo,pageSize){
    let url = this.ipSetting.ip + '/mmall/order/getOrderAllList/'+pageNo+'/'+pageSize+"?productName="+productName
      +"&orderId="+orderId+"&productId="+productId;
    return this.http.post(url,null,this.options)
      .map(res => res.json());
  }

  getReportAllList(order:any,pageNo,pageSize){
    let url = this.ipSetting.ip + '/mmall/order/getReportAllList/'+pageNo+'/'+pageSize;
    return this.http.post(url,order,this.options)
      .map(res => res.json());
  }

  deleteOrder(orderid){
    let url = this.ipSetting.ip + '/mmall/order/deleteGroupOrder/'+orderid;
    return this.http.post(url,this.options)
      .map(res => res.json());
  }

  updateOrder(order:any){
    let url = this.ipSetting.ip + '/mmall/order/updateGroupOrder/';
    let data = order;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  addMessage(order:any){
    let url = this.ipSetting.ip + '/mmall/order/addMessage/';
    let data = order;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  replayMessage(order:any){
    let url = this.ipSetting.ip + '/mmall/order/replayMessage/';
    let data = order;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  getMessage(orderid){
    let url = this.ipSetting.ip + '/mmall/order/getMessage/'+orderid;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }


}
