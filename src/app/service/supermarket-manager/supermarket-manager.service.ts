import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {IpSettingService} from "../ip-setting/ip-setting.service";


@Injectable()
export class SupermarketManagerService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true
  });
  constructor(
    private http: Http,
    private ipSetting  : IpSettingService
  ) { }

  getMarketProduct(id){
    const url = '/proxy/mmall/supermarket/getMarketProduct/'+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  getSupermarketList(pageNo:number,pageSize:number,search:any) {

    const url = '/proxy/mmall/supermarket/getSupermarketList/'+pageNo+'/'+pageSize;
    const data = search;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  getMarketShowList(pageNo:number,pageSize:number,search:any) {

    const url = '/proxy/mmall/supermarket/getMarketShowList/'+pageNo+'/'+pageSize;
    const data = search;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }


  providerList(pageNo,pageSize){
    const url = '/proxy/mmall/supermarket/provider/providerList/'+pageNo+'/'+ pageSize;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }


  providerSave(postData){
    const url = '/proxy/mmall/supermarket/provider/providerSave';
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  updateProduct(postData){
    const url = '/proxy/mmall/supermarket/updateProduct';
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  addMarketProduct(postData){
    const url = '/proxy/mmall/supermarket/addMarketProduct';
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }




  providerUpdate(appliar :any){
    const url = '/proxy/mmall/supermarket/provider/providerUpdate';
    const data = appliar;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  providerDetail(applyid){
    const url = '/proxy/mmall/supermarket/provider/detail/'+applyid;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  providerDel(applyid){
    const url = '/proxy/mmall/supermarket/provider/del/'+applyid;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  /*
   图片上传
   param: postData:img,
   return:
   */
  uploadImg(postData,type,id){
    const url = '/proxy/mmall/util/uploadImg/'+type+ '/' +id;
    var form = new FormData();
    if (typeof(postData) === 'object') {
      form.append('img', postData);
    }
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.withCredentials = true;
    xhr.send(form);
    return xhr;
  }

  deletetProduct(id){
    const url = '/proxy/mmall/supermarket/deletetProduct/'+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  delFile(id){
    const url = '/proxy/mmall/util/delFile/'+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  getCommonId(){
    const url = '/proxy/mmall/util/getCommonId';
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  uploadFile(postData,type,id){
    const url = '/proxy/mmall/util/uploadFile/'+type+ '/' +id;
    var form = new FormData();
    if (typeof(postData) === 'object') {
      form.append('file', postData);
    }
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.withCredentials = true;
    xhr.send(form);
    return xhr;
  }

  /**
   * 加入购物车
   * @param cart
   * @returns {OperatorFunction<T, R>}
   */
  addToCart(username,cart:any) {
    const url = '/proxy/mmall/supermarketCart/addSupermarketCart/'+username;
    const data = cart;

    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /**
   * 我的订单
   * @returns {Observable<R>}
   */
  getOrderList(pageNo,pageSize,status) {
    const url = '/proxy/mmall/supermarketOrder/getOrderList/' +pageNo+'/'+pageSize+'?search='+status;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /**
   * 订单管理
   * @param postData
   * @param pageNo
   * @param pageSize
   * @returns {Observable<R>}
   */
  getOrderAllList(postData,pageNo,pageSize){
    console.log(postData);
    const url = '/proxy/mmall/supermarketOrder/getOrderAllList/'
      +pageNo+'/'+pageSize;
    return this.http.post(url,postData,this.options)
      .map(res => res.json());
  }
  /**
   * 更新订单
   * @param order
   * @returns {Observable<R>}
   */
  updateOrder(order:any){
    const url = '/proxy/mmall/supermarketOrder/updateOrder/';
    const data = order;

    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /**
   * 删除订单
   * @param orderid
   * @returns {Observable<R>}
   */
  deleteOrder(orderid){
    const url = '/proxy/mmall/supermarketOrder/deleteOrder/'+orderid;
    return this.http.post(url,this.options)
      .map(res => res.json());
  }

  deleteCart(id,username){
    const url = '/proxy/mmall/supermarketCart/deleteCart/'+id+'/'+username;
    return this.http.get(url,this.options)
      .map(res => res.json());

  }
  /**
   * 获取购物车信息
   * @returns {OperatorFunction<T, R>}
   */
  getCartList(username){
    const url = '/proxy/mmall/supermarketCart/getCartList/'+username;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  /**
   * 修改购物车数量
   * @param postData
   * @returns {Observable<R>}
   */
  updateCart(postData,username){
    const url = '/proxy/mmall/supermarketCart/updateCart/'+username;
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  /**
   * 购物车结算
   * @param postData
   * @returns {Observable<R>}
   */
  submitCart(postData,code){
    const url = this.ipSetting.ip +'/mmall/supermarketOrder/addOrder/'+code;
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  getYzm(userId){
    const url = this.ipSetting.ip + '/mmall/supermarketOrder/getPayCode/'+userId;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

}
