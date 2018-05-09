import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {IpSettingService} from "../ip-setting/ip-setting.service";

@Injectable()
export class WorkflowService {

  constructor(
    private http: Http,
    private ipSetting  : IpSettingService
  ) { }
  /*新增工作流*/
  addFlow(data) {
    const url = this.ipSetting.ip + '/workflow/flow/addFlow';
    return this.http.post(url,data,this.ipSetting.options)
      .map(res => res.json());
  }
  /*编辑工作流*/
  editFlow(data) {
    const url = this.ipSetting.ip + '/workflow/flow/updateFlow';
    return this.http.post(url,data,this.ipSetting.options)
      .map(res => res.json());
  }
  /*获取所有群组作为工作流配置条件*/
  getGroupSelect(name) {
    const url = this.ipSetting.ip + '/workflow/group/getGroupSelect?name='+name;
    return this.http.get(url,this.ipSetting.options)
      .map(res => res.json());
  }
  /*获取工作流流程列表*/
  getFlowList(search,pageNo,pageSize) {
    const url = this.ipSetting.ip + '/workflow/flow/getFlowList/'+pageNo+'/'+pageSize;
    return this.http.post(url,search,this.ipSetting.options)
      .map(res => res.json());
  }
  /*修改工作流流程状态*/
  updateFlowStatus(data) {
    const url = this.ipSetting.ip + '/workflow/flow/updateFlowStatus';
    return this.http.post(url,data,this.ipSetting.options)
      .map(res => res.json());
  }
}
