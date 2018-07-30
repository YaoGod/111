import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { IpSettingService } from '../ip-setting/ip-setting.service';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class UtilBuildingService {

  private headers = new Headers();
  private options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true,
  });
  constructor(
    public http:Http,
    private ipSetting  : IpSettingService
  ) { }

  /*
   图片上传
   param: postData:file,
   return:
   */
  uploadImg(postData,type,id){
    const url = this.ipSetting.ip + "/building/util/uploadImg/"+type+ "/" +id;
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
  uploadImages(postData,type,id){
    const url = this.ipSetting.ip + "/party/util/uploadFile/"+type+ "/" +id;
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
  /*
   文件上传
   param: postData:file,
   return:
   */
  uploadFile(postData,type,id){
    const url = this.ipSetting.ip + "/building/util/uploadFile/"+type+ "/" +id;
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
  /*
   文件上传
   param: postData:file,
   return:
   */
  uploadFileReport(postData,type,id){
    const url = this.ipSetting.ip + "/party/report/uploadFile/"+type+ "/" +id;
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
  uploadFileTourLine(postData,type,id){
    const url = this.ipSetting.ip + "/soclaty/util/uploadFile/"+type+ "/" +id;
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
  /*
   能耗文件上传
   param: postData:file,
   return:
   */
  importTemplate(postData) {
    const url = this.ipSetting.ip +'/building/energy/importTemplate';
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
  /*
   疗休养导入
   param: postData:file,
   return:
   */
  importTemplateInfo(postData) {
    const url = this.ipSetting.ip +'/soclaty/tourenroll/importData';
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
  /*
   能耗文件上传
   param: postData:file,
   return:
   */
  importTempPermit(postData) {
    const url = this.ipSetting.ip +'/building/parking/importTemplate';
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
  /*
   文件上传
   param: postData:file,
   return:
   */
  importTemplate2(postData) {
    const url = this.ipSetting.ip + "/building/person/importTemplate";
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

  /*
   文件上传物业服务附件
   param: postData:file,
   return:
   */
  importEmployee(postData,type,id) {
    const url = this.ipSetting.ip + "/employee/property/uploadFile/"+ type +"/"+id;
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
  /*
   导入工号牌
   param: postData:file,
   return:
   */
  importCard(postData) {
    const url = this.ipSetting.ip + "/building/employCard/importData";
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
  /*获取大楼列表*/
  getBuildingList(search) {
    const url = this.ipSetting.ip + "/building/util/getBuildingList?search="+search;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*获取默认的服务中心*/
  getServiceCenter(){
    const url = this.ipSetting.ip + "/mmall/util/getServiceCenter";
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
}
