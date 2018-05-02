import { Component, OnInit } from '@angular/core';
import {UserPortalService} from "../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {User} from "../../mode/user/user.service";
import {GlobalUserService} from "../../service/global-user/global-user.service";
declare var $:any;
declare var confirmFunc:any;
@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  public user: User;
  public copyUser: User;
  public deptList: Array<any>;
  constructor(
    private globalUserService:GlobalUserService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService
  ) { }

  ngOnInit() {
    this.user = new User();
    this.user.userid = this.globalUserService.getVal().userid;
    this.copyUser = new User();
    this.getPersonalMsg(this.user.userid);
    this.getDeptList();
  }
  getPersonalMsg(id){
    this.userPortalService.getUserInfo(id)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.user = data.data;
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
            this.closeUserModal();
            this.getPersonalMsg(this.user.userid);
          }
        })
    }
  }
  /*编辑用户*/
  openUserModal(){
    this.copyUser =JSON.parse(JSON.stringify(this.user));
    $('#newUser').show();
  }
  closeUserModal(){
    this.copyUser = new User();
    $('.red').removeClass('red');
    $('.error').fadeOut();
    $('#newUser').hide();
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
}
