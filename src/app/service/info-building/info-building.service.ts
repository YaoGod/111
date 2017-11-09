import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class InfoBuildingService {

  constructor(
    private http: Http,
  ) { }
  /*
    获取大楼列表
    param: pageNo:number,    #页码
    param:  pageSize:number, #页码展示条数
    param:  search:string,   #搜索字段
    return:              #大楼基础信息实体类列表
   */
  getBuildingList (pageNo:number,pageSize:number,search:string) {
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    const url = '/proxy/building/info/getBuildingList/'+pageNo+'/'+pageSize+'?search='+search;
    const data = {};
    return this.http.post(url,data,options)
      .map(res => res.json());
  }
  /*
   获取大楼信息
   param: id:number,    #大楼ID
   return:   #大楼基础信息实体类
   */
  getBuildingMsg (id:number) {
    const url = '/proxy/building/info/getBuildingInfo/'+id;
    return this.http.get(url)
      .map(res => res.json());
  }
}
