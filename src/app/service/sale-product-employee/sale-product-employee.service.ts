import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { IpSettingService } from '../ip-setting/ip-setting.service';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class SaleProductEmployeeService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true
  });
  constructor(
    private http: Http,
    public ipSetting  : IpSettingService
  ) { }
  /*
   获取抢购商品(用户)
   param: search,pageNo,pageSize,
   return:
   */
  getSaleProductList(search,pageNo:number,pageSize:number){
    const url = this.ipSetting.ip + "/employee/flashsale/getUserSaleProductList/" +pageNo+ "/" + pageSize;
    return this.http.post(url,search,this.options)
      .map(res => res.json());
  }
  /*
   获取抢购商品(管理)
   param: search,pageNo,pageSize,
   return:
   */
  getSaleList(search,pageNo:number,pageSize:number){
    const url = this.ipSetting.ip + "/employee/flashsale/getAdminSaleProductList/" +pageNo+ "/" + pageSize;
    return this.http.post(url,search,this.options)
      .map(res => res.json());
  }
  /*
   获取单条抢购商品详情(用户)
   param: search,pageNo,pageSize,
   return:
   */
  getSaleProduct(id){
    const url = this.ipSetting.ip + "/employee/flashsale/getSaleProduct/" + id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   获取单条抢购商品令牌(用户)
   param: search,pageNo,pageSize,
   return:
   */
  getSaleProductKey(userId,id){
    const url = this.ipSetting.ip + "/employee/flashsale/getKey/" +userId+ "/" + id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*图片上传 */
  uploadImg(postData,type,id){
    const url = this.ipSetting.ip + "/employee/util/uploadImg/"+ type+"/"+id;
    let form = new FormData();
    if (typeof(postData) === 'object') {
      form.append('img', postData);
    }
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.withCredentials = true;
    xhr.send(form);
    return xhr;
  }
  /*获取所有部门*/
  getDeptList(){
    const url = this.ipSetting.ip + "/portal/user/getDeptList";
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*新增商品*/
  addSaleProduct(postData){
    const url = this.ipSetting.ip + "/employee/flashsale/addSaleProduct";
    return this.http.post(url,postData,this.options)
      .map(res => res.json());
  }
  /*更新商品*/
  updateSaleProduct(postData){
    const url = this.ipSetting.ip + "/employee/flashsale/updateSaleProduct";
    return this.http.post(url,postData,this.options)
      .map(res => res.json());
  }
  /*删除商品*/
  deleteSafeProduct(id){
    const url = this.ipSetting.ip +"/employee/flashsale/deleteSaleProduct/"+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*审核商品*/
  checkProduct(postData){
    const url = this.ipSetting.ip + "/employee/flashsale/checkProduct";
    return this.http.post(url,postData,this.options)
      .map(res => res.json());
  }
  /*获取主机时间*/
  getTime(){
    const url = this.ipSetting.ip +"/employee/flashsale/getTime";
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*获取验证码*/
  getYzm(id){
    const url = this.ipSetting.ip + "/employee/flashsale/getPhoneCode/"+ id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*提交订单*/
  addUserSaleOrder(code,postData,yzm){
    const url = this.ipSetting.ip + "/employee/flashsale/addUserSaleOrder?code="+code+"&phoneCode="+yzm;
    return this.http.post(url,postData,this.options)
      .map(res => res.json());
  }
}
