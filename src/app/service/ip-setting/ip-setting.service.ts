import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from "@angular/http";


@Injectable()
export class IpSettingService {
  private headers = new Headers({'Content-Type': 'application/json'});
  public options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true
  });
  /* nginx */
  public ip = "/proxy";
  // public ip = "http://localhost:8686";

  /*set ip and port for personal*/
 /* public ip = "http://10.71.246.83:8080";*/

 constructor(
    private http: Http,
  ) { }

  /*
   发送Post请求
   param: postData: any,          #发送实体类
   param: url: string             #相对请求路径
   return:                        #请求结果
   */
 public sendPost(url: string ,postData: any){
    const sendUrl = this.ip + url;
    const data = postData;
    return this.http.post(sendUrl,data,this.options)
      .map(res => res.json());
  }

  /*
   发送Get请求
   param: url: string,     #相对请求路径
   return:                 #请求结果
   */
  public sendGet(url: string) {
    const sendUrl = this.ip + url;
    return this.http.get(sendUrl,this.options)
      .map(res => res.json());
  }

  public uploadImg(url: string,postData: any){
    const sendUrl = this.ip + url;
    var form = new FormData();
    if (typeof(postData) === 'object') {
      form.append('img', postData);
    }
    const xhr = new XMLHttpRequest();
    xhr.open('POST', sendUrl, true);
    xhr.withCredentials = true;
    xhr.send(form);
    return xhr;
  }

  public uploadFile(url: string,postData: any){
    const sendUrl = this.ip + url;
    var form = new FormData();
    if (typeof(postData) === 'object') {
      form.append('file', postData);
    }
    const xhr = new XMLHttpRequest();
    xhr.open('POST', sendUrl, true);
    xhr.withCredentials = true;
    xhr.send(form);
    return xhr;
  }

}
