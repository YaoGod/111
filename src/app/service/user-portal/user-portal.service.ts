import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class UserPortalService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true
  });
  constructor(
    private http: Http,
  ) { }
  /*用户登陆*/
  portalLogin (data) {
    const url = '/proxy/portal/user/userLogin';
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*忘记密码发送短信重置密码*/
  getNewPassword(name) {
    const url = '/proxy/portal/user/forgetPassword/'+ name;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*更改密码*/
  updatePassword(userInfo,code){
    const url = "/proxy/portal/user/updatePassword/" + code;
    return this.http.post(url,userInfo,this.options)
      .map(res => res.json());
  }
  /*发送验证码*/
  sendMessage(type,target) {
    const url = "/proxy/portal/user/sendMessage/"+ type + "/" + target;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*获取目录信息*/
  getRoleCata(){
    const url = "/proxy/portal/user/getRoleCata";
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
}
