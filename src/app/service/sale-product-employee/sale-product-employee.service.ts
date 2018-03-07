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
   获取抢购商品
   param: search,pageNo,pageSize,
   return:
   */
  getSaleList(search,pageNo:number,pageSize:number){
    const url = this.ipSetting.ip + "/employee/Welfare/getWelfareList/"+pageNo+ "/" + pageSize + "?search=" + search;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   图片上传
   param: postData:file,
   return:
   */
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
  getDeptList(){
    const url = this.ipSetting.ip + "/portal/user/getDeptList";
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
}
