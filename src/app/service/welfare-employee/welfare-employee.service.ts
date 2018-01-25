import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { IpSettingService } from '../ip-setting/ip-setting.service';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class WelfareEmployeeService {

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
   图片上传
   param: postData:file,
   return:
   */
  uploadImg(postData,id){
    const url = this.ipSetting.ip + "/employee/Welfare/uploadImg/" +id;
    var form = new FormData();
    if (typeof(postData) === 'object') {
      form.append('img', postData);
    }
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.withCredentials = true;
    xhr.send(form);
    return xhr;
  }
  getTargetIdList(){
    const url = this.ipSetting.ip + "/employee/Welfare/getTargetId";
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   新增优惠信息
   param: postData:Welfare,
   return: res.json
   */
  addWelfare(data){
    const url = this.ipSetting.ip + "/employee/Welfare/addWelfare";
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   编辑优惠信息
   param: postData:Welfare,
   return: res.json
   */
  updateWelfare(data){
    const url = this.ipSetting.ip + "/employee/Welfare/updateWelfare";
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   查询优惠信息 (管理界面)
   param: search: string,
   param: pageNo: number,
   param: pageSize: number,
   return: res.json
   */
  getWelfareMang(search,pageNo:number,pageSize:number){
    const url = this.ipSetting.ip + "/employee/Welfare/getWelfare/"+pageNo+ "/" + pageSize + "?search=" + search;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   查询优惠信息 (用户界面)
   param: search: string,
   param: pageNo: number,
   param: pageSize: number,
   return: res.json
   */
  getWelfareList(search,pageNo:number,pageSize:number){
    const url = this.ipSetting.ip + "/employee/Welfare/getWelfareList/"+pageNo+ "/" + pageSize + "?search=" + search;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   删除优惠信息
   param: id:number,
   return: res.json
   */
  deleteWelfare(id:number){
    const url = this.ipSetting.ip + "/employee/Welfare/deleteWelfare/"+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*
   获取指定优惠信息
   param: id:number,
   return: res.json
   */
  getWelfare(id){
    const url = this.ipSetting.ip + "/employee/Welfare/getWelfareInfo/"+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  updateWelfareFeed(data){
    const url =  this.ipSetting.ip + "/employee/Welfare/updateWelfareFeed";
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*
   获取指定福利信息的统计信息（包含反馈信息）
   param: id:number,
   param: type:string(list or excel)
   return: res.json
   */
  getWelfareCount(id,type,pageNo,pageSize,search){
    const url = this.ipSetting.ip + "/employee/Welfare/getWelfareCount/"
      +id+"/"+type+"/"+pageNo+ "/" + pageSize +"?search=" + search;
    if(type === "excel"){
      window.open(url);
    }else{
      return this.http.get(url,this.options)
        .map(res => res.json());
    }
  }
  /*
   获取目标人员导入模板
   return: res.json
   */
  exportTemplate(){
    const url = this.ipSetting.ip + "/employee/Welfare/exportTemplate";
    window.open(url);
  }

  importTemplate(postData){
    const url = this.ipSetting.ip + "/employee/Welfare/importTemplate";
    var form = new FormData();
    if (typeof(postData) === 'object') {
      form.append('file', postData);
    }
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.withCredentials = true;
    xhr.send(form);
    return xhr;
  }
}
