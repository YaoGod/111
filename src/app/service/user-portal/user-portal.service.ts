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
    const url = this.ipSetting.ip + "/portal/util/sendMessage/"+ type + "/" + target;
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
  /*获取所有部门*/
  getDeptList(){
    const url = this.ipSetting.ip + "/portal/user/getDeptList";
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*新增用户*/
  addUserInfo(postData){
    const url = this.ipSetting.ip + '/portal/user/addUserInfo';
    return this.http.post(url,postData,this.options)
      .map(res => res.json());
  }
  /*删除用户*/
  deleteUserInfo(id){
    const url = this.ipSetting.ip + "/portal/user/deleteUserInfo/"+id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*获取所有用户信息列表*/
  getUserList(pageNo,pageSize,search){
    const url = this.ipSetting.ip + '/portal/user/getUserInfoList/'+pageNo+'/'+pageSize;
    return this.http.post(url,search,this.options)
      .map(res => res.json());
  }
  /*系统日志模块名下拉列表*/
  getModuleList(){
    const url = this.ipSetting.ip + '/portal/sysLog/getModuleList';
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*系统日志列表*/
  getSysLog(pageNo,pageSize,search){
    const url = this.ipSetting.ip + '/portal/sysLog/getSysLog/'+pageNo+'/'+pageSize+
    '?bTime='+search.bTime + '&eTime=' + search.eTime + '&module='+ search.module +'&dataType=list';
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*导出系统日志*/
  exportSysLog(pageNo,pageSize,search){
    const url = this.ipSetting.ip + '/portal/sysLog/getSysLog/'+pageNo+'/'+pageSize+
      '?bTime='+search.bTime + '&eTime=' + search.eTime + '&module='+ search.module +'&dataType=excel';
    return url;
  }
  /*获取操作文档下载地址*/
  getOptDoc(){
    const url = this.ipSetting.ip + '/portal/sysLog/getOptDoc/optDoc/1';
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*操作文档上传*/
  uploadFile(postData,type,id){
    const url = this.ipSetting.ip + "/portal/util/uploadFile/"+type+ "/" +id;
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
  /*获取操作文档上传权限*/
  getOptDocManage(){
    const url = this.ipSetting.ip + '/portal/sysLog/getOptDocManage';
    return this.http.get(url,this.options)
      .map(res => res.json());
  }

}
