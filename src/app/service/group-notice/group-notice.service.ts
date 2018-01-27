import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {isUndefined} from "util";
import {until} from "selenium-webdriver";
import titleContains = until.titleContains;
import {IpSettingService} from "../ip-setting/ip-setting.service";
@Injectable()
export class GroupNoticeService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true
  });

  constructor(
    private http: Http,
    private ipSetting: IpSettingService,
  ) { };

 /* 获取公告列表

  return:              #公告*/

  getNoticeList (title:any) {
    const url = this.ipSetting.ip + '/mmall/notice/getNoticeList';
    const data = title;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   新增公告信息
   param: id:number,     #公告ID
   return:
   */
  addGroupBuyNotice(postData){
    const url = this.ipSetting.ip + '/mmall/notice/addGroupbuyNotice';
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  /*
   删除公告信息
   param: id:number,     #大楼ID
   return:
   */
  deleteGroupbuyNotice (id:number) {
    const url = this.ipSetting.ip + '/mmall/notice/deleteGroupbuyNotice/'+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  getNotice(id:number){
    const url = this.ipSetting.ip + '/mmall/notice/getNotice/'+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   修改公告信息
   param: id:number,     #大楼ID
   return:
   */
  updateGroupBuyNotice(postData){
    console.log(postData);
    const url = this.ipSetting.ip + '/mmall/notice/updateGroupNotice';
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }

  getNoticeShowList(){
    const url = this.ipSetting.ip + '/mmall/notice/getNoticeShowList/';
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
}
