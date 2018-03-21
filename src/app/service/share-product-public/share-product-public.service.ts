import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { IpSettingService } from '../ip-setting/ip-setting.service';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class ShareProductPublicService {
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
   图片上传
   param: postData:file,
   return:
   */
  uploadImg(postData,type,id){
    const url = this.ipSetting.ip + "/publicresource/util/uploadImg/"+ type+"/"+id;
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
  /*新增商品*/
  addShareProduct(postData){
    const url = this.ipSetting.ip + "/publicresource/share/addShareProduct";
    return this.http.post(url,postData,this.options)
      .map(res => res.json());
  }
  /*更新商品*/
  updateShareProduct(postData){
    const url = this.ipSetting.ip + "/publicresource/share/uploadShareProduct";
    return this.http.post(url,postData,this.options)
      .map(res => res.json());
  }
  /*删除商品*/
  deleteShareProduct(id){
    const url = this.ipSetting.ip +"/publicresource/share/deleteShareProduct/"+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  getShareProductDetail(id){
    const url = this.ipSetting.ip +"/publicresource/share/getShareProductInfo/"+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*首页显示可预订的商品列表*/
  getShowProductList(postData,pageNo,pageSize){
    const url = this.ipSetting.ip + "/publicresource/share/getShowProduct/"+pageNo+"/"+pageSize;
    return this.http.post(url,postData,this.options)
      .map(res => res.json());
  }
  /*首页显示可预订的商品列表*/
  getCheckProductList(postData,pageNo,pageSize){
    const url = this.ipSetting.ip + "/publicresource/share/getProductManage/"+pageNo+"/"+pageSize;
    return this.http.post(url,postData,this.options)
      .map(res => res.json());
  }
  checkProduct(postData){
    const url = this.ipSetting.ip + "/publicresource/share/checkProduct";
    return this.http.post(url,postData,this.options)
      .map(res => res.json());
  }
}