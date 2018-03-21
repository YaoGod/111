import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from "@angular/http";
declare var $:any;

@Injectable()
export class IpSettingService {
  private headers = new Headers({'Content-Type': 'application/json'});
  public options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true
  });
  /* nginx */
  public ip = "/proxy";

  // public ip = "http://hzzh.zj.chinamobile.com/hzbs";
  // public ip = "http://localhost:8080";
  /*set ip and port for personal*/
  // public ip = "http://10.71.246.81:8080";
  // public ip = "http://10.71.246.83:8081";
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
  /*post请求下载文件*/
  public downLoadFile(options) {
    let config = $.extend(true, { method: 'post' }, options);
    let $iframe = $('<iframe id="down-file-iframe" />');
    let $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
    $form.attr('action', config.url);
    for(let key in config.data) {
      $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
    }
    $iframe.append($form);
    $(document.body).append($iframe);
    $form[0].submit();
    $iframe.remove();
  }

}
