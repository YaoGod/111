import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import { IpSettingService } from '../ip-setting/ip-setting.service';
@Injectable()
export class WorkspaceMydeskService {

  constructor(
    private http: Http,
    private ipSetting  : IpSettingService
  ) { }

  /*获取用户账户余额*/
  getBalance(){
    const url = this.ipSetting.ip + "/employee/mydesk/getBalance";
    return this.http.get(url,this.ipSetting.options)
      .map(res => res.json());
  }
  /*获取用户待办事项*/
  getHandlingOrder(){
    const url = this.ipSetting.ip + "/employee/mydesk/getHandlingOrder";
    return this.http.get(url,this.ipSetting.options)
      .map(res => res.json());
  }
  getServiceCenter(){
    const url = this.ipSetting.ip + "/employee/serviceCenter/getServiceCenter";
    return this.http.get(url,this.ipSetting.options)
      .map(res => res.json());
  }
}
