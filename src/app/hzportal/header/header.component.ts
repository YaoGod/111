import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Catalog } from '../../mode/catalog/catalog.service';
import { ErrorResponseService } from '../../service/error-response/error-response.service';
import { UserPortalService } from '../../service/user-portal/user-portal.service';
import { User } from '../../mode/user/user.service';
import { GlobalUserService } from '../../service/global-user/global-user.service';
import { GlobalCatalogService } from '../../service/global-catalog/global-catalog.service';
declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [UserPortalService]
})
export class HeaderComponent implements OnInit {
  public catalogs: Array<Catalog>;
  public user : User = new User();
  public password = "";
  public code = "";
  constructor(
    public router: Router,
    private globalUserService : GlobalUserService,
    private globalCatalogService : GlobalCatalogService,
    private errorResponse:ErrorResponseService,
    private userPortal: UserPortalService,
  ) {
    this.user = this.globalUserService.getVal();
  }

  ngOnInit() {
    this.globalUserService.valueUpdated.subscribe(
      (val) => {
        this.user = this.globalUserService.getVal();
      }
    );
    this.user = this.globalUserService.getVal();
    this.initCata();
    /*this.catalogs = [{
        name: '大楼信息管理',
        childs: [
          {
            name: '大楼基础信息',
            routeUrl: 'security/basic'
          },
          {
            name: '大楼日常管理',
            routeUrl: 'security/daily'
          },
          {
            name: '物业档案管理',
            routeUrl: 'security/property'
          }
        ]
      }];*/
  }
  /*初始化目录列表*/
  initCata(){
    this.userPortal.getRoleCata()
      .subscribe(data =>{
        if(this.errorResponse.errorMsg(data)){
          this.catalogs = data.data;
          this.globalCatalogService.setVal(this.catalogs);
        }
      })
  }

  private Listslider(event,url) {
    if(typeof(url) !== "undefined" && url !== null && url !== "") {
      this.router.navigate(["hzportal/" + url]);
    }
    $('.menu-one').not($(event.target)).removeClass('active');
    $(event.target).toggleClass('active');
    $('.menu-second').removeClass('active');
    $('.menu-second').stop().slideUp();
    $(event.target).siblings('ol').stop().slideToggle(); // addClass('abc');
    event.stopPropagation();
  }
  /*用户登出*/
  loginOut() {
    sessionStorage.setItem('isLoginIn', '');
    this.router.navigate(['login']);
  }
  /*修改密码*/
  rePassword() {
    console.log(this.user);
    $('#viewPassword').css('display','block');
  }
  submit() {
    this.isEmpty('msg','请输入验证码');
    this.verifyPassword('password');
    this.verifyPassword('sndpassword');
    if($(".red").length === 0) {
      if(this.code !== ""){
        this.userPortal.updatePassword(this.user,this.code)
          .subscribe(data => {
            if(this.errorResponse.errorMsg(data)){
              confirmFunc.init({
                'title': '提示' ,
                'mes': data.msg,
                'popType': 2 ,
                'imgType': 1,
                'callback':()=> {
                 this.code = "";
                 this.user.password = "";
                 this.password = "";
                 this.closeNewView();
                }
              });
            }
          });
      }
    }
  }
  /*添加楼层窗口关闭*/
  closeNewView() {
    $('.form-control').removeClass('red');
    $('.error').fadeOut();
    $('#viewPassword').css('display','none');
  }
  /*发送验证码*/
  sendCode() {
    if(typeof (this.user.username) !== "undefined" && this.user.username !== null){
      this.userPortal.sendMessage("updatePassword",this.user.username)
        .subscribe(data => {
          if(this.errorResponse.errorMsg(data)){
            confirmFunc.init({
              'title': '提示' ,
              'mes': data.msg,
              'popType': 2 ,
              'imgType': 1
            });
          }
        });
    }

  }
  private verifyPassword(id:string){
    if (!this.isEmpty(id,'· 请输入你的密码')) {
      return false;
    }
    if(!this.verifyLength(id, '· 密码长度过短')) {
      return false;
    }else{
      if(this.user.password !== this.password && this.password.length > 0) {
        this.addErrorClass(id, '两次密码不一致')
        return false
      }else {
        this.removeErrorClass(id);
        return true;
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
  private verifyIsNumber(id: string, error: string): boolean {
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
  private verifyLength(id: string, error: string): boolean {
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
    $('#' + id).addClass('red');
    $('#' + id).parent().next('.error').fadeIn().html(error);
  }
  /*去除错误信息*/
  private  removeErrorClass(id: string) {
    $('#' + id).removeClass('red');
    $('#' + id).parent().next('.error').fadeOut();
  }
}
