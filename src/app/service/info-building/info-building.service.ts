import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import { IpSettingService } from '../ip-setting/ip-setting.service';
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
    private ipSetting  : IpSettingService
  ) { }
  /*
    获取大楼列表
    param: pageNo:number,    #页码
    param:  pageSize:number, #页码展示条数
    param:  search:string,   #搜索字段
    return:              #大楼基础信息实体类列表
   */
  getBuildingList (pageNo:number,pageSize:number,search:any) {
    const url = this.ipSetting.ip + '/building/info/getBuildingList/'+pageNo+'/'+pageSize+'?search=';
    const data = search;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   获取指定大楼信息
   param: id:number,    #大楼ID
   return:   #大楼基础信息实体类
   */
  getBuildingMsg (id:number) {
    const url = this.ipSetting.ip + '/building/info/getBuildingInfo/'+id;
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
  getFloorListMsg (data:any,pageNo:number,pageSize:number) {
    const url = this.ipSetting.ip + '/building/info/getFloorList/'+pageNo+'/'+pageSize;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   获取指定大楼楼层名称列表
   param: id:number,     #大楼ID
   return:   #大楼基础信息实体类
   */
  getFloorNameListMsg(id:number){
    const url =this.ipSetting.ip + '/building/info/getFloorNumList/'+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   获取指定楼层信息
   param: id:number,     #楼层ID
   return:   #大楼基础信息实体类
   */
  getFloorMsg (id:number) {
    const url = this.ipSetting.ip + '/building/info/getFloorInfo/'+id;
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
  getRoomListMsg (floorId:number,pageNo: number,pageSize:number) {
    const url = this.ipSetting.ip + '/building/info/getRoomList/'+pageNo+'/'+pageSize;
    var data = {floorId:floorId};
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
 新增大楼信息
 param: postData:Building,          #大楼实体类
 return:
 */
  addBuilding(postData){
    const url = this.ipSetting.ip + '/building/info/addBuilding';
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   新增大楼楼层信息
   param: postData:Floor,          #大楼实体类
   return:
   */
  addFloor(postData){
    const url = this.ipSetting.ip + '/building/info/addFloor';
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   新增大楼房间信息
   param: postData:Room,          #大楼实体类
   return:
   */
  addRoom(postData){
    const url = this.ipSetting.ip + '/building/info/addRoom';
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   删除大楼信息
   param: id:number,     #大楼ID
   return:
   */
  deleteBuilding (id:number) {
    const url = this.ipSetting.ip + '/building/info/deleteBuilding/'+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   删除大楼楼层信息
   param: id:number,     #大楼ID
   return:
   */
  deleteFloor (id:number) {
    const url = this.ipSetting.ip + '/building/info/deleteFloor/'+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   删除大楼房间信息
   param: id:number,     #大楼ID
   return:
   */
  deleteRoom (id:number) {
    const url = this.ipSetting.ip + '/building/info/deleteRoom/'+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   更新大楼信息
   param: postData:Floor,          #大楼实体类
   return:
   */
  updateBuilding(postData){
    const url = this.ipSetting.ip + '/building/info/updateBuilding';
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   更新大楼楼层信息
   param: postData:Floor,          #大楼实体类
   return:
   */
  updateFloor(postData){
    const url = this.ipSetting.ip + '/building/info/updateFloor';
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   更新大楼房间信息
   param: postData:Floor,          #大楼实体类
   return:
   */
  updateRoom(postData){
    const url = this.ipSetting.ip + '/building/info/updateRoom';
    const data = postData;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
}
