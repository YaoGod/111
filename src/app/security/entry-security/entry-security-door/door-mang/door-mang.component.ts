import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {EntrySecurityService, EntryService} from "../../../../service/entry-security/entry-security.service";
import {GlobalUserService} from "../../../../service/global-user/global-user.service";

declare var $:any;
declare var confirmFunc:any;

@Component({
  selector: 'app-door-mang',
  templateUrl: './door-mang.component.html',
  styleUrls: ['./door-mang.component.css'],
  providers: [EntrySecurityService,ErrorResponseService]
})
export class DoorMangComponent implements OnInit {

  public pageNo;
  public pageSize = 10;
  public total = 0;
  public search: EntryService;
  public deptList: Array<any>;
  public entrySecurity:EntryService;
  public cardManage: Array<EntryService>;
  public buildings: Array<any>;

  constructor(
    private globalCatalogService: GlobalCatalogService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService,
    private globalUserService:GlobalUserService,
    private entrySecurityService:EntrySecurityService,
    private entryService:EntrySecurityService

  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("后勤物业/出入安全管理");
    this.cardManage = [];
    this.search = new EntryService();
    this.entrySecurity = new EntryService();
    this.search.deptId = '';// this.globalUserService.getVal().deptId;
    this.search.cardType = '';
    this.getUserList(1);
    this.getDeptList();
    this.getBuildingList();
  }

  /*获取用户信息列表*/
  getUserList(pageNo){
    this.pageNo = pageNo;
    this.entrySecurityService.getCardManageList(this.pageNo,this.pageSize,this.search)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          // console.log(data.data);
          this.cardManage = data.data.list;
          this.total = data.data.total;
        }
      })
  }
  /*获取所有部门下拉列表*/
  getDeptList(){
    this.entryService.getDeptList()
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.deptList = data.data;
        }
      })
  }

  /*获取大楼列表*/
  getBuildingList() {
    this.entrySecurityService.getBuildingList('')
      .subscribe(data => {
        if(this.errorResponseService.errorMsg(data)) {
          this.buildings = data.data;
        }
      })
  }

  closeNewUser(){
    this.entrySecurity = new EntryService();
    $('.red').removeClass('red');
    $('.error').html('');
    $('#newUser').hide();
  }

  /*批量导入*/
  selecteFile(){
    this.entrySecurity = new EntryService();
    $('#selecteFile').show();
  }
  closeFile(){
    this.entrySecurity = new EntryService();
    $('#selecteFile').hide();
  }

  /*新增提交*/
  submitNew(){
    let error = 0;
    /*this.verifyEmpty(this.entrySecurity.userid,'userid');
    this.verifyEmpty(this.entrySecurity.username,'username');
    this.verifyEmpty(this.entrySecurity.deptId,'deptId');*/
    if($('.red').length === 0 && error === 0) {
      this.userPortalService.addUserInfo(this.entrySecurity)
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

  /*修改*/
  editRecord(index) {
    this.entrySecurity = JSON.parse(JSON.stringify(this.cardManage[index]));
    this.entrySecurity.status = '正常';
    this.entrySecurity.cardType = '自有员工';
    $('#newUser').show();
  }

  /*提交修改*/
  submitPassword(){
    let error = 0;
    if($('.red').length === 0 && error === 0) {
      this.userPortalService.updatePassword(this.entrySecurity, '0')
        .subscribe(data => {
          if (this.errorResponseService.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示',
              'mes': data.msg,
              'popType': 2,
              'imgType': 1,
            });
            this.closeNewUser();
          }
        })
    }
  }

  /*授权或取消授权*/
  cancelOrAuthority(id){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否取消授权？',
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
/*导出*/
  downloadTemplates() {
    console.log('下载模板');
  }

}
export class DoorMang {

  buildingId: string;
  buildingName: string;
  cardCode: string;
  cardType: string;
  floorNum: string;
  id: number;
  modifyTime: string;
  modifyUserId:string;
  note: string;
  roomNum: string;
  status: string;
  type: string;
  userDept: string;
  userId: string;
  userName: string;
  deptId: string;
}
