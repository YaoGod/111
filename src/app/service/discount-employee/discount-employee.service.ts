import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { IpSettingService } from '../ip-setting/ip-setting.service';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class DiscountEmployeeService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true
  });
  constructor(
    private http: Http,
    private ipSetting  : IpSettingService
  ) { }
  /*
   图片上传
   param: postData:file,
   return:
   */
  uploadImg(postData,type,id){
    const url = this.ipSetting.ip + "/employee/util/uploadImg/"+type+"/"+id;
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
  uploadFile(postData,id){
    const url = this.ipSetting.ip + "/employee/discount/uploadFile/discount/" +id;
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
  /*
   新增优惠信息
   param: postData:Discount,
   return: res.json
   */
  addDiscount(data){
    const url = this.ipSetting.ip + "/employee/discount/addDiscount";
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   编辑优惠信息
   param: postData:Discount,
   return: res.json
   */
  updateDiscount(data){
    const url = this.ipSetting.ip + "/employee/discount/updateDiscount";
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   查询优惠信息
   param: search: string,
   param: pageNo: number,
   param: pageSize: number,
   return: res.json
   */
  getDiscountList(type,search,pageNo:number,pageSize:number){
    const url = this.ipSetting.ip + "/employee/discount/getDiscount/"+type+ "/" +pageNo+ "/" + pageSize + "?search=" + search;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   删除优惠信息
   param: id:number,
   return: res.json
   */
  deleteDiscount(id:number){
    const url = this.ipSetting.ip + "/employee/discount/deleteDiscount/"+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   获取指定优惠信息
   param: id:number,
   return: res.json
   */
  getDiscount(id){
    const url = this.ipSetting.ip + "/employee/discount/getDiscountInfo/"+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
}
