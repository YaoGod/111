import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class InfoBuildingService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true
  });
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
    const url = '/proxy/building/info/getBuildingList/'+pageNo+'/'+pageSize+'?search='+search;
    const data = {};
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   获取指定大楼信息
   param: id:number,    #大楼ID
   return:   #大楼基础信息实体类
   */
  getBuildingMsg (id:number) {
    const url = '/proxy/building/info/getBuildingInfo/'+id;
    return this.http.get(url,this.options)
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
    return this.http.get(url,this.options)
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
    return this.http.get(url,this.options)
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
  getRoomListMsg (id:number,floorId:number,pageNo: number,pageSize:number) {
    const url = '/proxy/building/info/getRoomList/'+id+'/'+floorId+'/'+pageNo+'/'+pageSize;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   新增大楼信息
   param: postData:Building,          #大楼实体类
   return:
   */
  addBuilding(postData){
    const url = '/proxy/building/info/addBuilding';
    const data = {postData};
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   新增大楼楼层信息
   param: postData:Floor,          #大楼实体类
   return:
   */
  addFloor(postData){
    const url = '/proxy/building/info/addFloor';
    const data = {postData};
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   新增大楼房间信息
   param: postData:Room,          #大楼实体类
   return:
   */
  addRoom(postData){
    const url = '/proxy/building/info/addRoom';
    const data = {postData};
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   删除大楼信息
   param: id:number,     #大楼ID
   return:
   */
  deleteBuilding (id:number) {
    const url = '/proxy/building/info/deleteBuilding/'+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   删除大楼楼层信息
   param: id:number,     #大楼ID
   return:
   */
  deleteFloor (id:number) {
    const url = '/proxy/building/info/deleteFloor/'+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   删除大楼房间信息
   param: id:number,     #大楼ID
   return:
   */
  deleteRoom (id:number) {
    const url = '/proxy/building/info/deleteRoom/'+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   更新大楼信息
   param: postData:Floor,          #大楼实体类
   return:
   */
  updateBuilding(postData){
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    const url = '/proxy/building/info/updateBuilding';
    const data = {postData};
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   更新大楼楼层信息
   param: postData:Floor,          #大楼实体类
   return:
   */
  updateFloor(postData){
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    const url = '/proxy/building/info/updateFloor';
    const data = {postData};
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   更新大楼楼层信息
   param: postData:Floor,          #大楼实体类
   return:
   */
  updateRoom(postData){
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    const url = '/proxy/building/info/updateRoom';
    const data = {postData};
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
}
