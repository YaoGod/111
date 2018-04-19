import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from "@angular/http";
import {IpSettingService} from "../ip-setting/ip-setting.service";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class EntrySecurityService {
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
  getCardManageList(pageNo,pageSize,search){
    const url = this.ipSetting.ip + '/building/employCard/getList/'+pageNo+'/'+pageSize;
    return this.http.post(url,search,this.options)
      .map(res => res.json());
  }

  /*新增*/
  addCardInfo(postData){
    const url = this.ipSetting.ip + '/building/employCard/add';
    return this.http.post(url,postData,this.options)
      .map(res => res.json());
  }

  /*修改*/
  modifyCardInfo(postData){
    const url = this.ipSetting.ip + '/building/employCard/modify';
    return this.http.post(url,postData,this.options)
      .map(res => res.json());
  }

  /*删除*/
  delCardInfo(postData){
    const url = this.ipSetting.ip + '/building/employCard/del';
    return this.http.post(url,postData,this.options)
       .map(res => res.json());
  }

  /*获取所有部门*/
  getDeptList(){
    const url = this.ipSetting.ip + "/portal/user/getDeptList";
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  /*获取大楼列表*/
  getBuildingList(search) {
    const url = this.ipSetting.ip + "/building/util/getBuildingList?search="+search;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  /*获取全部服务公司*/
  getCompany() {
    const url = this.ipSetting.ip + "/building/company/getCompany";
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

  /*系统日志列表*/
  getSysLog(pageNo,pageSize,search){
    const url = this.ipSetting.ip + '/portal/sysLog/getSysLog/'+pageNo+'/'+pageSize+
      '?bTime='+search.bTime + '&eTime=' + search.eTime + '&module='+ search.module +'&dataType=list';
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

}

export class EntryService {

  /*登陆用户*/
  id       : number;
  userid   : string;

  cardNo   : string;
  cardStatus: string;
  cardType: string;
  employee: string; /*员工姓名*/
  employNo: string; /*员工编号*/
  companyName: string;  /*服务公司名称*/

  username : string;
  password : string;
  teleNum  : string;
  homeAddr : string;
  deptId   : string;
  deptName : string;
  oaEmail  : string;
  status   : string;
  building : string;
  productType: string;  /*选择的类型*/

  userId : number;
  userName:string;
  operationModule:string;
  operationContent: string;
  operationTime : string;
  clientIp: string;
  module : string;
  bTime  : string;
  eTime  : string;

}
