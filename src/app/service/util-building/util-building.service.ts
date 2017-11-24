import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class UtilBuildingService {

  private headers = new Headers();
  private options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true,
  });
  constructor(
    public http:Http
  ) { }

  /*
   图片上传
   param: postData:file,
   return:
   */
  uploadImg(postData,type,id){
    const url = '/proxy/building/util/uploadImg/'+type+ '/' +id;
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
    const url = '/proxy/building/util/uploadFile/'+type+ '/' +id;
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
