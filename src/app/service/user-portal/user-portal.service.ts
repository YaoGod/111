import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers} from '@angular/http';
import { IpSettingService } from '../ip-setting/ip-setting.service';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class UserPortalService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true,
  });
  constructor(
    private http: Http,
    private ipSetting  : IpSettingService
  ) { }
  /*用户登陆*/
  portalLogin (data) {
    const url = this.ipSetting.ip + '/portal/user/userLogin';
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*忘记密码发送短信重置密码*/
  getNewPassword(name) {
    const url = this.ipSetting.ip + '/portal/user/forgetPassword/'+ name;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*更改密码*/
  updatePassword(userInfo,code){
    const url  = this.ipSetting.ip + "/portal/user/updatePassword/" + code;
    return this.http.post(url,userInfo,this.options)
      .map(res => res.json());
  }
  /*发送验证码*/
  sendMessage(type,target) {
    const url = this.ipSetting.ip + "/portal/user/sendMessage/"+ type + "/" + target;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*获取目录信息*/
  getRoleCata(){
    const url = this.ipSetting.ip + "/portal/user/getRoleCata";
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*密文登陆*/
  getEncryptLogin(data){
    const url = this.ipSetting.ip + '/portal/user/ttmm/'+data;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
}
