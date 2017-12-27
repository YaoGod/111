import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {isUndefined} from "util";
import {until} from "selenium-webdriver";
import titleContains = until.titleContains;

@Injectable()
export class GroupProductService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true
});
  constructor(
    private http: Http,
  ) { };
  /* 获取商品列表

   return:              #公告*/

  getProductList(pageNo:number,pageSize:number,search:any) {
    const url = '/proxy/mmall/group/getProductList/'+pageNo+'/'+pageSize;
    const data = search;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   新增商品信息
   param: id:number,     #公告ID
   return:
   */
  addGroupBuyProduct(postData){
    console.log(postData);
    const url = '/proxy/mmall/group/addGroupbuyProduct';
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  /*
   删除公告信息
   param: id:number,     #大楼ID
   return:
   */
  deleteGroupbuyProduct (code:string) {
    const url = '/proxy/mmall/group/deleteGroupbuyProduct/'+code;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   查询该code的商品
   param: id:number,     #大楼ID
   return:
   */
  getGroupProduct(code:string){
    const url = '/proxy/mmall/group/getGroupProduct/'+code;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  /*
   修改商品信息
   param: id:number,     #大楼ID
   return:
   */
updateGroupbuyProduct(postData){
    console.log(postData);
    const url = '/proxy/mmall/group/updateGroupbuyProduct';
    const data = postData;
    return this.http.post(url,data,this.options)
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

  /* 获取商品列表

   return:              #商品*/

  getProductShowList(pageNo:number,pageSize:number,search:any) {
    const url = '/proxy/mmall/group/getProductShowList/'+pageNo+'/'+pageSize;
    const data = search;
    console.log(data);
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  addToCart(cart:any) {
    const url = '/proxy/mmall/cart/addGroupbuyCart';
    const data = cart;
    console.log(data);
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  getCartList(){
    const url = '/proxy/mmall/cart/getCartList/';
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  deleteGroupCart(id:number){
    const url = '/proxy/mmall/cart/deleteGroupbuyCart/'+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  updateGroupCart(postData){
    const url = '/proxy/mmall/cart/updateGroupbuyCart';
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  submitCart(){
    const url = '/proxy/mmall/order/addGroupOrder';
    return this.http.post(url,this.options)
      .map(res => res.json());
  }
  /*
   审核商品信息
   param: id:number,     #大楼ID
   return:
   */
  checkGroupbuyProduct(postData){
    console.log(postData);
    const url = '/proxy/mmall/group/updateGroupbuyProduct';
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
}
