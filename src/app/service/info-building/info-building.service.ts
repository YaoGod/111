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
   获取指定大楼信息
   param: id:number,    #大楼ID
   return:   #大楼基础信息实体类
   */
  getBuildingMsg (id:number) {
    const url = '/proxy/building/info/getBuildingInfo/'+id;
    return this.http.get(url)
      .map(res => res.json());
  }
  /*
   获取指定大楼楼层列表信息
   param: id:number,     #大楼ID
   param: pageNo:number,    #页码
   param:  pageSize:number, #页码展示条数
   return:   #大楼基础信息实体类
   */
  getFloorListMsg (id:number,pageNo:number,pageSize:number) {
    const url = '/proxy/building/info/getFloorList/'+id+'/'+pageNo+'/'+pageSize;
    return this.http.get(url)
      .map(res => res.json());
  }
  /*
   获取指定楼层信息
   param: id:number,     #大楼ID
   param: num:number,    #楼层号
   return:   #大楼基础信息实体类
   */
  getFloorMsg (id:number,num: string) {
    const url = '/proxy/building/info/getFloorInfo/'+id+'/'+num;
    return this.http.get(url)
      .map(res => res.json());
  }
  /*
   获取指定房间列表信息
   param: id:number,          #大楼ID
   param: floorId:number,     #楼层ID
   param: pageNo:number,      #当前页数
   param: pageSize:number,    #该页最大数
   return:   #大楼基础信息实体类
   */
  getRoomMsg (id:number,floorId:number,pageNo: number,pageSize:number) {
    const url = '/proxy/building/info/getRoomList/'+id+'/'+floorId+'/'+pageNo+'/'+pageSize;
    return this.http.get(url)
      .map(res => res.json());
  }
}
