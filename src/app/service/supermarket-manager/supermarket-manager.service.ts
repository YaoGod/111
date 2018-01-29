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
    let url =  this.ipSetting.ip + '/mmall/supermarket/getMarketProduct/'+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  getSupermarketList(pageNo:number,pageSize:number,search:any) {

    let url =  this.ipSetting.ip + '/mmall/supermarket/getSupermarketList/'+pageNo+'/'+pageSize;
    let data = search;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  getMarketShowList(pageNo:number,pageSize:number,data:any) {
    let url =  this.ipSetting.ip + '/mmall/supermarket/getMarketShowList/'+pageNo+'/'+pageSize;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }


  providerList(pageNo,pageSize){
    let url =  this.ipSetting.ip + '/mmall/supermarket/provider/providerList/'+pageNo+'/'+ pageSize;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }


  providerSave(postData){
    let url =  this.ipSetting.ip + '/mmall/supermarket/provider/providerSave';
    let data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  updateProduct(postData){
    let url =  this.ipSetting.ip + '/mmall/supermarket/updateProduct';
    let data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  addMarketProduct(postData){
    let url =  this.ipSetting.ip + '/mmall/supermarket/addMarketProduct';
    let data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }




  providerUpdate(appliar :any){
    let url =  this.ipSetting.ip + '/mmall/supermarket/provider/providerUpdate';
    let data = appliar;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  providerDetail(applyid){
    let url =  this.ipSetting.ip + '/mmall/supermarket/provider/detail/'+applyid;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  providerDel(applyid){
    let url =  this.ipSetting.ip + '/mmall/supermarket/provider/del/'+applyid;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  /*
   图片上传
   param: postData:img,
   return:
   */
  uploadImg(postData,type,id){
    const url =  this.ipSetting.ip + '/mmall/util/uploadImg/'+type+ '/' +id;
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
    let url =  this.ipSetting.ip + '/mmall/supermarket/deletetProduct/'+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  delFile(id){
    let url =  this.ipSetting.ip + '/mmall/util/delFile/'+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  getCommonId(){
    let url =  this.ipSetting.ip + '/mmall/util/getCommonId';
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  uploadFile(postData,type,id){
    const url =  this.ipSetting.ip + '/mmall/util/uploadFile/'+type+ '/' +id;
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
    let url =  this.ipSetting.ip + '/mmall/supermarketCart/addSupermarketCart/'+username;
    let data = cart;

    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /**
   * 我的订单
   * @returns {Observable<R>}
   */
  getOrderList(pageNo,pageSize,status) {
    let url =  this.ipSetting.ip + '/mmall/supermarketOrder/getOrderList/' +pageNo+'/'+pageSize+'?search='+status;
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
  getOrderAllList(type,ids,data,pageNo,pageSize){
    ids = ids.join(',');
    let postData = JSON.parse(JSON.stringify(data));
    if(typeof (postData.creatBgtime)!=="undefined"){
      postData.creatBgtime = postData.creatBgtime.replace(/-/g,'/');
    }if(typeof (postData.creatEdtime)!=="undefined"){
      postData.creatEdtime = postData.creatEdtime.replace(/-/g,'/');
    }if(typeof (postData.giveBgtime)!=="undefined"){
      postData.giveBgtime = postData.giveBgtime.replace(/-/g,'/');
    }if(typeof (postData.giveEdtime)!=="undefined"){
      postData.giveEdtime = postData.giveEdtime.replace(/-/g,'/');
    }
    let url = this.ipSetting.ip+'/mmall/supermarketOrder/getOrderAllList/'+type+'/'
      +pageNo+'/'+pageSize +"?ids=" + ids;
    if(type === 'list'){
      return this.http.post(url,postData,this.options)
        .map(res => res.json());
    }else{
    /*  return this.http.get(url,this.options)
        .map(res => res.json());
*/
      window.open(url);
     /* this.ipSetting.downLoadFile({
        url:url,
        data:postData
      });*/
    }
  }
  /**
   * 更新订单
   * @param order
   * @returns {Observable<R>}
   */
  updateOrder(order:any){
    let url = this.ipSetting.ip + '/mmall/supermarketOrder/updateOrder/';
    let data = order;

    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /**
   * 删除订单
   * @param orderid
   * @returns {Observable<R>}
   */
  deleteOrder(orderid){
    let url = this.ipSetting.ip + '/mmall/supermarketOrder/deleteOrder/'+orderid;
    return this.http.post(url,this.options)
      .map(res => res.json());
  }

  deleteCart(id,username){
    let url = this.ipSetting.ip + '/mmall/supermarketCart/deleteCart/'+id+'/'+username;
    return this.http.get(url,this.options)
      .map(res => res.json());

  }
  /**
   * 获取购物车信息
   * @returns {OperatorFunction<T, R>}
   */
  getCartList(username){
    let url = this.ipSetting.ip + '/mmall/supermarketCart/getCartList/'+username;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  /**
   * 修改购物车数量
   * @param postData
   * @returns {Observable<R>}
   */
  updateCart(postData,username){
    let url = this.ipSetting.ip + '/mmall/supermarketCart/updateCart/'+username;
    let data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  /**
   * 购物车结算
   * @param postData
   * @returns {Observable<R>}
   */
  submitCart(postData,code){
    let url = this.ipSetting.ip +'/mmall/supermarketOrder/addOrder/'+code;
    let data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  getYzm(userId){
    let url = this.ipSetting.ip + '/mmall/supermarketOrder/getPayCode/'+userId;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

}
