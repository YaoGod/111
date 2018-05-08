import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {IpSettingService} from "../ip-setting/ip-setting.service";

@Injectable()
export class WorkflowService {

  constructor(
    private http: Http,
    private ipSetting  : IpSettingService
  ) { }

  addFlow(data) {
    const url = this.ipSetting.ip + '/workflow/flow/addFlow';
    return this.http.post(url,data,this.ipSetting.options)
      .map(res => res.json());
  }
}
