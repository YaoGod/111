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
  /*获取人员消费记录*/
  getUserConsume(type){
    const url = this.ipSetting.ip + "/employee/mydesk/getUserConsume/" + type;
    return this.http.get(url,this.ipSetting.options)
      .map(res => res.json());
  }
  /*修改人员归属的服务中心*/
  setMyService(data){
    const url = this.ipSetting.ip + "/employee/mydesk/updateServiceCenter/" + data;
    return this.http.get(url,this.ipSetting.options)
      .map(res => res.json());
  }
  /*获取用户消费记录列表*/
  getUserConsumeList(type,pageNo,pageSize){
    const url = this.ipSetting.ip + "/employee/mydesk/getUserConsumeList/"+pageNo+"/"+pageSize+"/"+type;
    return this.http.get(url,this.ipSetting.options)
      .map(res => res.json());
  }
  /*获取用户充值记录列表*/
  getUserRechargeList(pageNo,pageSize){
    const url = this.ipSetting.ip + "/employee/mydesk/getUserRechargeList/"+pageNo+"/"+pageSize;
    return this.http.get(url,this.ipSetting.options)
      .map(res => res.json());
  }
  /*获取用户事项列表*/
  getHandlingOrderInfo(type,status){
    if(status === ""){
      status = "null";
    }
    const url = this.ipSetting.ip + "/employee/mydesk/getHandlingOrderInfo/"+type+"/"+status;
    return this.http.get(url,this.ipSetting.options)
      .map(res => res.json())
  }
}
