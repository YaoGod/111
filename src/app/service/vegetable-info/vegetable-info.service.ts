import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {IpSettingService} from "../ip-setting/ip-setting.service";

@Injectable()
export class VegetableInfoService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true
  });
  constructor(
    private http: Http,
    private ipSetting  : IpSettingService
  ) { };
  /* 获取净菜列表

   return:              #公告*/

  getVegetableList(pageNo:number,pageSize:number,search:any) {
    const url = this.ipSetting.ip +'/mmall/vegetableInfo/getVegetableList/'+pageNo+'/'+pageSize;
    const data = search;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  /*
   查询该code的净菜
   param: code:number,     #
   return:
   */
  getVegetable(code:string){
    const url = this.ipSetting.ip +'/mmall/vegetableInfo/getVegetable/'+code;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   新增净菜信息
   return:
   */
  addVegetable(postData){

    const url = this.ipSetting.ip +'/mmall/vegetableInfo/addVegetable';
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   修改净菜信息
   param: id:number,     #净菜id
   return:
   */
  updateVegetable(postData){
    const url = this.ipSetting.ip +'/mmall/vegetableInfo/updateVegetable';
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   删除净菜信息
   param: id:number,
   return:
   */
  deleteVegetable (code:string) {
    const url = this.ipSetting.ip +'/mmall/vegetableInfo/deleteVegetable/'+code;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   图片上传
   param: postData:img,
   return:
   */
  uploadImg(postData,type,id){
    const url = this.ipSetting.ip +'/mmall/util/uploadImg/'+type+ '/' +id;
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

  /**
   * guobing
   * 查询在售净菜信息
   * @param pageNo
   * @param pageSize
   * @param search
   * @returns {OperatorFunction<T, R>}
   */
  getVegetableShowList(pageNo:number,pageSize:number,search:any) {
    const url = this.ipSetting.ip +'/mmall/vegetableInfo/getVegetableShowList/'+pageNo+'/'+pageSize;
    const data = search;

    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  /**
   * 加入购物车
   * @param cart
   * @returns {OperatorFunction<T, R>}
   */
  addToCart(cart:any) {
    const url = this.ipSetting.ip +'/mmall/vegetabelCart/addVegetableCart';
    const data = cart;

    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  /**
   * 获取购物车信息
   * @returns {OperatorFunction<T, R>}
   */
  getCartList(){
    const url = this.ipSetting.ip +'/mmall/vegetabelCart/getCartList/';
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  /**
   * 删除购物车信息
   * @param id
   * @returns {Observable<R>}
   */
  deleteVegetableCart(id:number){
    const url = this.ipSetting.ip +'/mmall/vegetabelCart/deleteVegetableCart/'+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  /**
   * 修改购物车数量
   * @param postData
   * @returns {Observable<R>}
   */
  updateVegetableCart(postData){
    const url = this.ipSetting.ip +'/mmall/vegetabelCart/updateVegetableCart';
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
    const url = this.ipSetting.ip +'/mmall/vegetabelOrder/addVegetableOrder/'+code;
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  /**
   * 我的订单
   * @returns {Observable<R>}
   */
  getOrderList() {
    const url = this.ipSetting.ip +'/mmall/vegetabelOrder/getOrderList/null';
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  /**
   * 订单管理
   * @param productName
   * @param orderId
   * @param productId
   * @param pageNo
   * @param pageSize
   * @returns {Observable<R>}
   */
  getOrderAllList(productName,orderId,productId,pageNo,pageSize){
    const url = this.ipSetting.ip +'/mmall/vegetabelOrder/getOrderAllList/'+pageNo+'/'+pageSize+"?productName="+productName+"&orderId="+orderId+"&productId="+productId;
    return this.http.post(url,this.options)
      .map(res => res.json());
  }

  /**
   * 更新订单
   * @param order
   * @returns {Observable<R>}
   */
  updateOrder(order:any){
    const url = this.ipSetting.ip +'/mmall/vegetabelOrder/iVegetableOrder/';
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
    const url = this.ipSetting.ip +'/mmall/vegetabelOrder/deleteVegetableOrder/'+orderid;
    return this.http.post(url,this.options)
      .map(res => res.json());
  }

  getYzm(userId){
    const url = this.ipSetting.ip +'/mmall/vegetabelOrder/getPayCode/'+userId;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
}
