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
    return: {{data: (string|null|((node:any)=>any)  #大楼基础信息实体类
   */
  getBuildingMsg (pageNo:number,pageSize:number,search:string) {
    return this.http.get('/proxy/building/info/getBuildingList/'+pageNo+'/'+pageSize+'?search='+search)
      .map(res => res.json());
  }
}
