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
  /*获取大楼列表*/
  getBuildingList() {
    const url = this.ipSetting.ip + "/building/util/getBuildingList";
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
}
