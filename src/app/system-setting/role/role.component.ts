import { Component, OnInit } from '@angular/core';
import {Role} from "../../mode/user/user.service";
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
declare var $:any;
declare var confirmFunc:any;

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  public pageNo;
  public pageSize = 10;
  public total = 0;
  public search: Role;
  public roles: Array<Role>;
  public deptList: Array<any>;
  public copyRole: Role;
  public winTitle: string;
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService,

  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("系统管理/角色管理");
    this.roles = [];
    this.search = new Role();
    this.search.roleName = "";
    this.copyRole = new Role();
    this.getRoleList(1);
    this.getDeptList();
  }
  /*获取权限信息列表*/
  getRoleList(pageNo){
    this.pageNo = pageNo;
    this.userPortalService.getRoleList(this.pageNo,this.pageSize,this.search)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.roles = data.data.infos;
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
  /*删除角色*/
  delete(id){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除该角色？',
      'popType': 1,
      'imgType': 3,
      "callback": () => {
        this.userPortalService.deleteRoleInfo(id)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.data,
                'popType': 2,
                'imgType': 1
              });
              this.getRoleList(1);
            }
          });
      }
    });
  }
  /*编辑角色*/
  edit(role:Role){
    this.newUser();
    this.winTitle = "编辑";
    this.copyRole = JSON.parse(JSON.stringify(role));
  }
  /*新建角色*/
  newUser(){
    this.copyRole = new Role();
    this.winTitle = "新增";
    $('#newUser').show();
  }
  closeNewUser(){
    this.copyRole = new Role();
    $('.red').removeClass('red');
    $('.error').fadeOut();
    $('#newUser').hide();
  }
  /*新增角色表单提交*/
  submit(){
    let error = 0;
    this.verifyEmpty(this.copyRole.roleId,'roleId');
    this.verifyEmpty(this.copyRole.roleName,'roleName');
    if($('.red').length === 0 && error === 0) {
      if(this.winTitle === "新增"){
        this.userPortalService.addRoleInfo(this.copyRole)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.data,
                'popType': 2,
                'imgType': 1,
              });
              this.closeNewUser();
              this.getRoleList(1);
            }
          })
      }
      else {
        this.userPortalService.updateRoleInfo(this.copyRole)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.data,
                'popType': 2,
                'imgType': 1,
              });
              this.closeNewUser();
              this.getRoleList(1);
            }
          })
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
