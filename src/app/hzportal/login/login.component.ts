import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { User } from "../../mode/user/user.service";
import { UserPortalService } from '../../service/user-portal/user-portal.service';
import { ErrorResponseService } from '../../service/error-response/error-response.service';
import { GlobalUserService } from '../../service/global-user/global-user.service';
import * as $ from 'jquery';
declare var confirmFunc: any;
declare var $: any;
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ UserPortalService,]
})
export class LoginComponent implements OnInit {
  public user: User;
  public save_passwd:boolean;
  public catalogs:any;
  constructor(
    private router: Router,
    private errorResponse:ErrorResponseService,
    private userPortal: UserPortalService,
    private globalUserService:GlobalUserService,
  ) {
  }
  ngOnInit() {
    this.user = new User();
    this.save_passwd = localStorage.getItem("save_passwd")?true:false;
    if(this.save_passwd) {
      this.user.userid = localStorage.getItem("username");
      this.user.password = localStorage.getItem("password");
    }
  }
  /*登陆*/
  loginIn() {
    let user = {
      userid: this.user.userid,
      password: this.user.password
    };
    if(this.verifyUserName('userName') && this.verifyPassword('password')){
      this.userPortal.portalLogin(user)
        .subscribe(data => {
          if(this.errorResponse.errorMsg(data)) {
            if(data.data.result === 'illegal') {
              this.addErrorClass('password','密码错误');
              sessionStorage.removeItem("save_passwd");
              localStorage.removeItem("username");
              localStorage.removeItem("password");
            }else {
              this.globalUserService.setVal(data.data.userInfo);
              sessionStorage.setItem("isLoginIn","Login");
              this.save_passwd?localStorage.setItem("save_passwd","true"):localStorage.removeItem("save_passwd");
              localStorage.setItem("username",data.data.userInfo.userid);
              localStorage.setItem("password",this.user.password);
              localStorage.setItem("teleNum",data.data.userInfo.teleNum);
              localStorage.setItem("deptName",data.data.userInfo.deptName);
              this.navigateUrl();
            }
          }else {
            localStorage.removeItem("save_passwd");
            localStorage.removeItem("username");
            localStorage.removeItem("password");
          }
        });
    }
  }
  private navigateUrl(){
    this.userPortal.getRoleCata()
      .subscribe(data =>{
        if(this.errorResponse.errorMsg(data)){
          this.catalogs = data.data;
          if(this.catalogs!==null&&this.catalogs.length>0){
            if(this.catalogs[0].routeUrl!==null){
              this.router.navigate([this.catalogs[0].routeUrl]);
            }else{
              this.router.navigate(['hzportal/'+this.catalogs[0].childs[0].routeUrl]);
            }
          }
        }
      });
  }

  private verifyUserName(id:string){
      if (!this.isEmpty(id,'· 请输入你的用户名')) {
        return false;
      }
      if(!this.verifyLength(id, '· 户名编号过短'))  {
        return false;
      }
      return true;
  }
  private verifyPassword(id:string){
  if (!this.isEmpty(id,'· 请输入你的登录密码')) {
    return false;
  }
  if(!this.verifyLength(id, '· 密码长度过短'))  {
    return false;
  }
  return true;
}


  /*回车登陆*/
  keyLogin(event: any) {

    if (event.keyCode == 13) {
      if (typeof this.user.userid === 'undefined' ||  this.user.userid === '') {
        $('#userName').focus();
      }else if ( typeof this.user.password === 'undefined' || this.user.password === '') {
        $('#password').focus();
      }else {
        this.loginIn();
      }
    }
  }

  //  校验是否为空
  private isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if (data.toString().trim() === '')  {
      this.addErrorClass(id,error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /*匹配数字*/
  private verifyIsNumber(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if (!String(data).match(/^[0-9]*$/))  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /*匹配长度*/
  private verifyLength(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if (data.length < 5)  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /* 添加错误信息*/
  private addErrorClass(id: string, error: string)  {
    $('#' + id).parents('.input').addClass('red');

    $('#' + id).parents('.input').siblings('.error').fadeIn().html(error);
  }
  /*去除错误信息*/
  private  removeErrorClass(id: string) {
    $('#' + id).parents('.input').removeClass('red');
    $('#' + id).parents('.input').siblings('.error').fadeOut();
  }
  findPassword() {
    if(typeof(this.user.userid) === "undefined" ||
      this.user.userid === null ||
      this.user.userid === '') {
      $('#userName').focus();
      this.addErrorClass("userName","请先输入您要找回的用户名称。")
    }else {
      this.userPortal.getNewPassword(this.user.userid)
        .subscribe(data =>{
          if(this.errorResponse.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示' ,
              'mes': data.msg,
              'popType': 0 ,
              'imgType': 1 ,
            });
          }
        })
    }
  }
}
