import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { User } from "../../mode/user/user.service";
import { UserPortalService } from '../../service/user-portal/user-portal.service';
import * as $ from 'jquery';
declare var $: any;
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ UserPortalService ]
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private userPortal: UserPortalService
  ) {
  }
  public user: User;
  ngOnInit() {
    this.user = {
      id: 1,
      name: '',
      password: ''
    };
  }
  /*登陆*/
  loginIn(){
    let data = {
      username: this.user.name,
      password: this.user.password
    };
    if(this.verifyUserName('userName') && this.verifyPassword('password')){
      console.log(data)
      this.userPortal.portalLogin(data)
        .subscribe(data =>{
          if(data['status'] === 0){
            console.log(data);
            sessionStorage.setItem("isLoginIn","Login");
            this.router.navigate(['/hzportal/']);
          }else{
            console.log(data);
          }

        });
    }else{

    }
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

    if (event.keyCode == 13) {console.log(this.user.name);
      if (typeof this.user.name === 'undefined' ||  this.user.name === '') {
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
}
