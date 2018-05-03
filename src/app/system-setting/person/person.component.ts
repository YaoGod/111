import { Component, OnInit } from '@angular/core';
import {UserPortalService} from "../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {User} from "../../mode/user/user.service";
import {GlobalUserService} from "../../service/global-user/global-user.service";
import {sndCatalog} from "../../mode/catalog/catalog.service";
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
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
  public rule: sndCatalog = new sndCatalog();
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private globalUserService:GlobalUserService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService
  ) {
    this.rule = this.globalCatalogService.getRole("system/person");
  }

  ngOnInit() {
    this.user = new User();
    this.user.userid = this.globalUserService.getVal().userid;
    this.copyUser = new User();
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("system/person");
      }
    );
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
      let postdata = JSON.parse(JSON.stringify(this.copyUser));
      for(let i = 0;i<this.deptList.length;i++){
        if(postdata.deptId === this.deptList[i].DEPT_NAME){
          postdata.deptId = this.deptList[i].DEPT_ID;
        }
      }
      this.userPortalService.uploadUserInfo(postdata)
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
      if(value.length<3){
        this.addErrorClass(id,'长度过短');
        return false;
      }
      this.removeErrorClass(id);
      return true;
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
