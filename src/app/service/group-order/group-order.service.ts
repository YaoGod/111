import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {isUndefined} from "util";
import {until} from "selenium-webdriver";
import titleContains = until.titleContains;

@Injectable()
export class GroupOrderService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true
  });
  constructor(
    private http: Http,
  ) { };

  getOrderList() {
    const url = '/proxy/mmall/order/getOrderList/null';
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  getOrderItems(orderId) {
    const url = '/proxy/mmall/order/getOrderItems/'+orderId;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }


  getOrderAllList(productName,orderId,productId,pageNo,pageSize){
    const url = '/proxy/mmall/order/getOrderAllList/'+pageNo+'/'+pageSize+"?productName="+productName
      +"&orderId="+orderId+"&productId="+productId;
    return this.http.post(url,this.options)
      .map(res => res.json());
  }

  getReportAllList(order:any,pageNo,pageSize){
    const url = '/proxy/mmall/order/getReportAllList/'+pageNo+'/'+pageSize;
    return this.http.post(url,order,this.options)
      .map(res => res.json());
  }

  deleteOrder(orderid){
    const url = '/proxy/mmall/order/deleteGroupOrder/'+orderid;
    return this.http.post(url,this.options)
      .map(res => res.json());
  }

  updateOrder(order:any){
    const url = '/proxy/mmall/order/updateGroupOrder/';
    const data = order;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  addMessage(order:any){
    const url = '/proxy/mmall/order/addMessage/';
    const data = order;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  replayMessage(order:any){
    const url = '/proxy/mmall/order/replayMessage/';
    const data = order;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  getMessage(orderid){
    const url = '/proxy/mmall/order/getMessage/'+orderid;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }


}
