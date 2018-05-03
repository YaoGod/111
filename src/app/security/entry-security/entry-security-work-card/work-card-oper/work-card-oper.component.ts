import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {GlobalUserService} from "../../../../service/global-user/global-user.service";
import {EntrySecurityService, EntryService} from "../../../../service/entry-security/entry-security.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {UtilBuildingService} from "../../../../service/util-building/util-building.service";
import {Http} from "@angular/http";

declare var $:any;
declare var confirmFunc:any;

@Component({
  selector: 'app-work-card-oper',
  templateUrl: './work-card-oper.component.html',
  styleUrls: ['./work-card-oper.component.css'],
  providers: [EntrySecurityService,ErrorResponseService,UtilBuildingService]
})
export class WorkCardOperComponent implements OnInit {

  public pageNo;
  public pageSize = 15;
  public total = 0;
  public search: EntryService;
  public deptList: Array<any>;
  public serviceCom: Array<any>;
  public entrySecurity:EntryService;
  public cardManage: Array<EntryService>;
  public changeWay;
  public userList:Array<any>;
  constructor(
    private http: Http,
    private globalCatalogService: GlobalCatalogService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService,
    private globalUserService:GlobalUserService,
    private utilBuildingService:UtilBuildingService,
    private entrySecurityService:EntrySecurityService,
    public ipSetting  : IpSettingService,

  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("后勤物业/出入安全管理");
    this.search = new EntryService();
    this.entrySecurity = new EntryService();
    this.cardManage = [];
    // this.search.deptId = this.globalUserService.getVal().deptId;
    this.getCompanyList();
    this.getDeptList();
    this.search.userid = '';
    this.search.employee = '';
    this.search.deptId = '';
    this.search.cardType = '';
    this.search.cardStatus = '';
    this.search.eTime = '';
    this.search.bTime = '';

  }

  /*获取信息列表*/
  getCardManageList(pageNo){
    this.pageNo = pageNo;
    let url = '/building/employCard/getCardList/'+pageNo+'/'+this.pageSize;
    this.ipSetting.sendPost(url,this.search).subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          let arr = [];
          for (let i in data.data.list) {
            for (let j in this.deptList) {
             if (this.deptList[j].DEPT_NAME === data.data.list[i].deptName){
             data.data.list[i].deptId = this.deptList[j].DEPT_ID;
             }
            }
            arr.push(data.data.list[i]);
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
    $('.modal-title').html('工号牌新增');
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
  /*导出数据下载*/
  public downDeriving(){
    let url = this.ipSetting.ip + "/building/employCard/export?userId="+ this.search.userid+'&&employee='+this.search.employee+
      '&&userDept='+this.search.deptId+'&&type='+this.search.cardType+'&&bTime='+this.search.bTime+'&&eTime='
      +this.search.eTime+'&&cardStatus='+this.search.cardStatus;
    this.http.get(url)
    // .map(res => res.json())
      .subscribe(data => {
        window.location.href = url;
        $('#deriving').fadeOut();
      });
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
                'mes': data.msg,
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
                'mes': data.msg,
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
  getUserList(id,status){
    let url = "/portal/user/getUserBySome/"+status;
    let postData = {
      deptId: id
    };
    this.ipSetting.sendPost(url,postData).subscribe(data => {
      if (this.errorResponseService.errorMsg(data)) {
        this.userList = data.data;
        /*this.entrySecurity.employee = data.data.username;
         for (let j in this.deptList) {
         if (this.deptList[j].DEPT_NAME === data.data.deptId) {
         this.entrySecurity.deptId = this.deptList[j].DEPT_ID;
         }
         }*/
      }
    });
  }
  getUserNo(name){
    for (let j in this.userList) {
      if (this.userList[j].username === name) {
        this.entrySecurity.employNo = this.userList[j].userid;
      }
    }
  }
  /*根据员工号获取人员和姓名*/
  getUserName(value) {
    if (value && value.length > 7) {
      let url = "/portal/user/getUserInfo/" + value;
      this.ipSetting.sendGet(url).subscribe(data => {
        if (this.errorResponseService.errorMsg(data)) {
          this.entrySecurity.employee = data.data.username;
          for (let j in this.deptList) {
            if (this.deptList[j].DEPT_NAME === data.data.deptId){
              this.entrySecurity.deptId = this.deptList[j].DEPT_ID;
            }
          }
          // this.entrySecurity.deptId = data.data.deptId;
        }
        if (data.status === 1) {
          this.entrySecurity.employee = '';
          this.entrySecurity.deptId = '';
        }
      });
    }
  }

  /*修改*/
  editRecord(index) {
    this.changeWay = 'modify';
    this.entrySecurity = JSON.parse(JSON.stringify(this.cardManage[index]));
    $('#newUser').show();
    $('.modal-title').html('工号牌编辑');
  }
  alertRecord(){
    confirmFunc.init({
      'title': '提示',
      'mes': '该员工号牌已失效',
      'popType': 2,
      'imgType': 2
    });
  }

  /*删除*/
  delete(index){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否使该员工号失效？',
      'popType': 1,
      'imgType': 3,
      "callback": () => {
        let postData = JSON.parse(JSON.stringify(this.cardManage[index]));
        postData.employNo = postData.userId;
        postData.cardStatus = '2';
        this.entrySecurityService.modifyCardInfo(postData)
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
  /*导入*/
  prese_upload(files) {
    var xhr = this.utilBuildingService.importCard(files[0]);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorResponseService.errorMsg(data)) {
          if(data.status === 0 ){/*&& data.data.result==='success'*/
            if(data.data.result==='fail'){
              confirmFunc.init({
                'title': '提示',
                'mes': '导入失败，是否下载错误信息？',
                'popType': 1,
                'imgType': 3,
                "callback": () => {
                  window.location.href = this.ipSetting.ip+'/building/employCard/downExcel/'+data.data.fileName;
                }
              })
            }else{
              confirmFunc.init({
                'title': '提示' ,
                'mes': '导入成功',
                'popType': 0 ,
                'imgType': 1,
              });
            }
          }
          $('#prese').val('');
          $('#selecteFile').hide();
          this.pageNo = 1;
          this.getCardManageList(1);
        }else{
          $('#prese').val('');
        }
      }
    };
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
