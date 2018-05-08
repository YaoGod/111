import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from "@angular/http";
import {IpSettingService} from "../ip-setting/ip-setting.service";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class FlowService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true,
  });
  constructor(
    private http: Http,
    private ipSetting  : IpSettingService
  ) { }

  /*获取所有用户信息列表*/
  getUserList(postData){
    const url = this.ipSetting.ip + '/portal/user/getUserBySome/1';
    return this.http.post(url,postData,this.options)
      .map(res => res.json());
  }

  /*获取指定用户的指定群组*/
  getUserGroup(userId){
    const url = this.ipSetting.ip + '/workflow/group/getUserGroup/'+userId;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  /*导入*/
  importCard(postData,id) {
    const url = this.ipSetting.ip + "/workflow/group/importData/"+id;
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


}


export class FlowConfigure {
  id: number;
  username:string;
  name     : string;
  isdept      : string;
  status   : string;
  userid: string;
  deptId: string;

}

