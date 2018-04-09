import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import {IpSettingService} from "../ip-setting/ip-setting.service";

@Injectable()
export class PublicresourceVoteService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true
  });
  constructor(
    private http: Http,
    public ipSetting  : IpSettingService
  ) { }
  /*获取所有部门*/
  getDeptList(){
    const url = this.ipSetting.ip + "/portal/user/getDeptList";
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   图片上传
   param: postData:file,
   return:
   */
  uploadImg(postData,type){
    const url = this.ipSetting.ip + "/publicresource/vote/uploadImg/"+ type;
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
  /*添加投票信息*/
  addVoteInfo(postdata){
    const url = this.ipSetting.ip + "/publicresource/vote/addVoteInfo";
    return this.http.post(url,postdata,this.options)
      .map(res => res.json());
  }
  /*添加投票信息*/
  updateVoteInfo(postdata){
    const url = this.ipSetting.ip + "/publicresource/vote/updateVoteInfo";
    return this.http.post(url,postdata,this.options)
      .map(res => res.json());
  }
}
