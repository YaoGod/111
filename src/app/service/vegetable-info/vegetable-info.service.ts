import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';

@Injectable()
export class VegetableInfoService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true
  });
  constructor(
    private http: Http,
  ) { };
  /* 获取净菜列表

   return:              #公告*/

  getVegetableList(pageNo:number,pageSize:number,search:any) {
    console.log(search);
    const url = '/proxy/mmall/vegetable/getVegetableList/'+pageNo+'/'+pageSize;
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
    const url = '/proxy/mmall/vegetable/getVegetable/'+code;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   新增净菜信息
   return:
   */
  addVegetable(postData){
    console.log(postData);
    const url = '/proxy/mmall/vegetable/addVegetable';
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
    console.log(postData);
    const url = '/proxy/mmall/vegetable/updateVegetable';
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
    const url = '/proxy/mmall/vegetable/deleteVegetable/'+code;
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

  /**
   * guobing
   * 查询在售净菜信息
   * @param pageNo
   * @param pageSize
   * @param search
   * @returns {OperatorFunction<T, R>}
   */
  getVegetableShowList(pageNo:number,pageSize:number,search:any) {
    const url = '/proxy/mmall/vegetable/getVegetableShowList/'+pageNo+'/'+pageSize;
    const data = search;
    console.log(data);
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  /**
   * 加入购物车
   * @param cart
   * @returns {OperatorFunction<T, R>}
   */
  addToCart(cart:any) {
    const url = '/proxy/mmall/vegetabelCart/addVegetableCart';
    const data = cart;
    console.log(data);
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  /**
   * 获取购物车信息
   * @returns {OperatorFunction<T, R>}
   */
  getCartList(){
    const url = '/proxy/mmall/vegetabelCart/getCartList/';
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  /**
   * 删除购物车信息
   * @param id
   * @returns {Observable<R>}
   */
  deleteVegetableCart(id:number){
    const url = '/proxy/mmall/vegetabelCart/deleteVegetableCart/'+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  /**
   * 修改购物车数量
   * @param postData
   * @returns {Observable<R>}
   */
  updateVegetableCart(postData){
    const url = '/proxy/mmall/vegetabelCart/updateVegetableCart';
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  /**
   * 购物车结算
   * @param postData
   * @returns {Observable<R>}
   */
  submitCart(postData){
    const url = '/proxy/mmall/vegetabelOrder/addVegetableOrder';
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  /**
   * 我的订单
   * @returns {Observable<R>}
   */
  getOrderList() {
    const url = '/proxy/mmall/vegetabelOrder/getOrderList/null';
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
    const url = '/proxy/mmall/vegetabelOrder/getOrderAllList/'+pageNo+'/'+pageSize+"?productName="+productName+"&orderId="+orderId+"&productId="+productId;
    return this.http.post(url,this.options)
      .map(res => res.json());
  }

  /**
   * 更新订单
   * @param order
   * @returns {Observable<R>}
   */
  updateOrder(order:any){
    const url = '/proxy/mmall/vegetabelOrder/iVegetableOrder/';
    const data = order;
    console.log(data);
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  /**
   * 删除订单
   * @param orderid
   * @returns {Observable<R>}
   */
  deleteOrder(orderid){
    const url = '/proxy/mmall/vegetabelOrder/deleteVegetableOrder/'+orderid;
    return this.http.post(url,this.options)
      .map(res => res.json());
  }
}
