import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {User} from "../../mode/user/user.service";
import {UserPortalService} from "../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {GlobalUserService} from "../../service/global-user/global-user.service";
declare var $:any;
declare var confirmFunc:any;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public pageNo;
  public pageSize = 10;
  public total = 0;
  public search: User;
  public users: Array<User>;
  public deptList: Array<any>;
  public copyUser: User;
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService,
    private globalUserService:GlobalUserService

  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("系统管理/用户管理");
    this.users = [];
    this.search = new User();
    this.copyUser = new User();
    this.search.deptId = this.globalUserService.getVal().deptId;
    this.getUserList(1);
    this.getDeptList();
  }
  /*获取用户信息列表*/
  getUserList(pageNo){
    this.pageNo = pageNo;
    this.userPortalService.getUserList(this.pageNo,this.pageSize,this.search)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.users = data.data.infos;
          this.total = data.data.total;
        }
      })
  }
  /*获取所有部门下拉列表*/
  getDeptList(){
    this.userPortalService.getDeptList()
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.deptList = data.data;
        }
      })
  }
  /*删除用户*/
  delete(id){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除该用户？',
      'popType': 1,
      'imgType': 3,
      "callback": () => {
        this.userPortalService.deleteUserInfo(id)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1
              });
              this.getUserList(1);
            }
          });
      }
    });
  }
  /*编辑用户*/
  edit(user:User){
    this.newUser();
    this.copyUser = JSON.parse(JSON.stringify(user));
  }
  /*新建用户*/
  newUser(){
    this.copyUser = new User();
    this.copyUser.userid = "66";
    $('#newUser').show();
  }
  closeNewUser(){
    this.copyUser = new User();
    $('.red').removeClass('red');
    $('.error').fadeOut();
    $('#newUser').hide();
  }
  /*新增用户表单提交*/
  submit(){
    let error = 0;
    this.verifyUserId(this.copyUser.userid,'userid');
    this.verifyEmpty(this.copyUser.username,'username');
    this.verifyEmpty(this.copyUser.deptId,'deptId');
    if($('.red').length === 0 && error === 0) {
      this.userPortalService.addUserInfo(this.copyUser)
        .subscribe(data => {
          if (this.errorResponseService.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示',
              'mes': data.msg,
              'popType': 2,
              'imgType': 1,
            });
            this.closeNewUser();
            this.getUserList(1);
          }
        })
    }
  }
  /*非空验证*/
  verifyEmpty( value, id?){
    if(typeof (value) === "undefined" ||
      value === null ||
      value === ''){
      this.addErrorClass(id,'该值不能为空');
      return false;
    }else{
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
  /*修改密码*/
  editPassword(user:User){
    this.copyUser = JSON.parse(JSON.stringify(user));
    this.copyUser.flag = "custom";
    $('#editPassword').show();
  }
  closePassword(){
    this.copyUser = new User();
    $('#editPassword').hide();
  }
  /*提交新密码*/
  submitPassword(){
    let error = 0;
    this.verifyEmpty(this.copyUser.password,'password');
    if($('.red').length === 0 && error === 0) {
      this.userPortalService.updatePassword(this.copyUser, '0')
        .subscribe(data => {
          if (this.errorResponseService.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示',
              'mes': data.msg,
              'popType': 2,
              'imgType': 1,
            });
            this.closePassword();
          }
        })
    }
  }
  verifyUserId(value,id){
    if(this.verifyEmpty(value,id)){
     if(value.indexOf('66')!==0){
       this.addErrorClass(id,'第三方人员的HRMIS需以66开头');
       return false;
     }else{
       if(value.length<3){
         this.addErrorClass(id,'长度过短');
         return false;
       }
       this.removeErrorClass(id);
       return true;
     }
    }
  }
}
