import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {GlobalUserService} from "../../../../service/global-user/global-user.service";
import {EntrySecurityService, EntryService} from "../../../../service/entry-security/entry-security.service";

declare var $:any;
declare var confirmFunc:any;

@Component({
  selector: 'app-work-card-mang',
  templateUrl: './work-card-mang.component.html',
  styleUrls: ['./work-card-mang.component.css'],
  providers: [EntrySecurityService,ErrorResponseService]
})
export class WorkCardMangComponent implements OnInit {

  public pageNo;
  public pageSize = 10;
  public total = 0;
  public search: EntryService;
  public deptList: Array<any>;
  public serviceCom: Array<any>;
  public entrySecurity:EntryService;
  public cardManage: Array<EntryService>;
  public changeWay;

  constructor(
    private globalCatalogService: GlobalCatalogService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService,
    private globalUserService:GlobalUserService,
    private entrySecurityService:EntrySecurityService

  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("后勤物业/出入安全管理");
    this.search = new EntryService();
    this.entrySecurity = new EntryService();
    // this.search.deptId = this.globalUserService.getVal().deptId;
    this.getCompanyList();
    this.getDeptList();
    this.cardManage = [];
  }

  /*获取信息列表*/
  getCardManageList(pageNo){
    this.pageNo = pageNo;
    this.entrySecurityService.getCardManageList(this.pageNo,this.pageSize,this.search)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          let arr = [];
          for (let i in data.data.list) {
            for (let j in this.deptList) {
              if (this.deptList[j].DEPT_ID === data.data.list[i].deptId){
                data.data.list[i].deptName = this.deptList[j].DEPT_NAME;
                arr.push(data.data.list[i]);
              }
            }
          }
          this.cardManage = arr;
          this.total = data.data.total;
        }
      })
  }
  /*获取所有部门下拉列表*/
  getDeptList(){
    this.entrySecurityService.getDeptList()
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.deptList = data.data;
          this.getCardManageList(1);
        }
      })
  }

  /*获取全部服务公司*/
  getCompanyList(){
    this.entrySecurityService.getCompany()
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.serviceCom = data.data;
        }
      })
  }

  /*新建用户*/
  newUser(){
    this.changeWay = 'new';
    this.entrySecurity = new EntryService();
    this.entrySecurity.cardStatus = '1';  /*正常1, 失效2*/
    this.entrySecurity.cardType = '1';  /*自有员工1, 第三方员工0*/
    $('#newUser').show();
  }
  closeNewUser(){
    this.entrySecurity = new EntryService();
    $('.red').removeClass('red');
    $('.error').fadeOut();
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

  /*新增/修改 提交*/
  submitNew(){
    let error = 0;
    this.verifyEmpty(this.entrySecurity.cardNo,'cardNo');
    this.verifyEmpty(this.entrySecurity.cardStatus,'cardStatus');   /*正常1, 失效2*/
    this.verifyEmpty(this.entrySecurity.cardType,'cardType');    /*自有员工1, 第三方员工0*/
    this.verifyEmpty(this.entrySecurity.employee,'employee');
    if (this.entrySecurity.cardType==='1') {
      this.verifyEmpty(this.entrySecurity.employNo,'employNo');
    }else if (this.entrySecurity.cardType==='0') {
      this.verifyEmpty(this.entrySecurity.companyName,'employNo');
    }
    this.verifyEmpty(this.entrySecurity.deptId,'deptId');
    if($('.red').length === 0 && error === 0) {
      if (this.changeWay === 'new') {
        this.entrySecurityService.addCardInfo(this.entrySecurity)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg+'1',
                'popType': 2,
                'imgType': 1,
              });
              this.closeNewUser();
              this.getCardManageList(1);
            }
          })
      }else {
        this.entrySecurityService.modifyCardInfo(this.entrySecurity)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg+'2',
                'popType': 2,
                'imgType': 1,
              });
              this.closeNewUser();
              this.getCardManageList(1);
            }
          })
      }
    }
  }


  /*修改*/
  editRecord(index) {
    this.changeWay = 'modify';
    this.entrySecurity = JSON.parse(JSON.stringify(this.cardManage[index]));
    $('#newUser').show();
  }

  // /*提交修改*/
  // submitEditRecord(){
  //   let error = 0;
  //   this.verifyEmpty(this.entrySecurity.password,'password');
  //   if($('.red').length === 0 && error === 0) {
  //     this.userPortalService.updatePassword(this.entrySecurity, '0')
  //       .subscribe(data => {
  //         if (this.errorResponseService.errorMsg(data)) {
  //           confirmFunc.init({
  //             'title': '提示',
  //             'mes': data.msg,
  //             'popType': 2,
  //             'imgType': 1,
  //           });
  //           this.closeNewUser();
  //         }
  //       })
  //   }
  // }

  /*删除*/
  delete(id){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除该记录？',
      'popType': 1,
      'imgType': 3,
      "callback": () => {
        this.entrySecurityService.delCardInfo(id)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1
              });
              this.getCardManageList(1);
            }
          });
      }
    });
  }

  downloadTemplates() {
    console.log('下载模板');
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
