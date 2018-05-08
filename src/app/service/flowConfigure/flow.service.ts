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

  /*新增*/
  add(postData){
    const url = this.ipSetting.ip + '/building/employCard/add';
    return this.http.post(url,postData,this.options)
      .map(res => res.json());
  }

  /*导入*/
  importCard(postData) {
    const url = this.ipSetting.ip + "/building/employCard/importData";
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
  name     : string;
  isdept      : string;
  status   : string;

}

