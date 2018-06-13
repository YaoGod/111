import { Component, OnInit } from '@angular/core';
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {Http} from "@angular/http";
import {UserPortalService} from "../../../service/user-portal/user-portal.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";

declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-caselist',
  templateUrl: './caselist.component.html',
  styleUrls: ['./caselist.component.css'],
  providers:[UtilBuildingService]
})
export class CaselistComponent implements OnInit {

  public deptList:Array<any>;
  public recordList:Array<any>;
  public pageSize = 15;
  public pageNo = 1;
  public total = 0;
  public length = 10;
  public newCard = new CardInfo();
  public searchInfo = new CardInfo();
  private contractBool = true;

  constructor(
    public http:Http,
    public ipSetting:IpSettingService,
    private userPortalService:UserPortalService,
    private utilBuildingService:UtilBuildingService,
    public errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
  ) { }


  ngOnInit() {
    this.globalCatalogService.setTitle("党建管理/工作台账上传");
    this.searchInfo.createUserId = localStorage.getItem("username");
    this.searchInfo.branchName = '';
    this.searchInfo.month = '';
    this.recordList = [];

    this.getDeptList();
    this.repairSearch(1);

  }

  /*获取所有部门下拉列表*/
  getDeptList(){
    this.userPortalService.getDeptList()
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.deptList = data.data;
        }
      })
  }

  /*查询*/
  repairSearch(num){
    let url = "/party/report/getList/"+num+"/"+this.pageSize;
    let postData = {type: '4', branchName: this.searchInfo.branchName, month: this.searchInfo.month};
    this.ipSetting.sendPost(url,postData).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.recordList = data.data.list;
        this.total = data.data.total;
      }
    });
  }

  /*点击新增*/
  addVehicle(){
    this.contractBool = true;
    $('.form-disable').attr('disabled',false).css('backgroundColor','#fff');
    this.newCard = new CardInfo();
    this.newCard.type = '4';
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('新增党建实践案例');
  }

  /*附件上传*/
  prese_upload(files) {
    var xhr = this.utilBuildingService.uploadFileReport(files[0],'partyBuild',-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          this.newCard.fileName.push(files[0].name);
          this.newCard.filePath.push(data.data);
          confirmFunc.init({
            'title': '提示' ,
            'mes': '上传成功',
            'popType': 0 ,
            'imgType': 1,
          });
          $('#prese').val('');
        }
      }else if (xhr.readyState === 4 && xhr.status === 413){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '文件太大',
          'popType': 0 ,
          'imgType': 2,
        });
        $('#prese').val('');
      }
    };
  }

  /*提交*/
  submit(){
    let url;
    if(this.contractBool === false){
      url = "/party/update/updateractice";  /*更新*/
    }else{
      url = "/party/add/addPractice";  /*新增*/
    }
    if (!this.verifybranchName() || !this.verifymonth() || !this.verifyanlitype() || !this.verifycaseName() || !this.verifycaseNote()) {
      return false;
    }
    this.ipSetting.sendPost(url, this.newCard).subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        confirmFunc.init({
          'title': '提示' ,
          'mes': this.contractBool === false?'更新成功':'新增成功',
          'popType': 0 ,
          'imgType': 1 ,
        });
        this.repairSearch(1);
        this.addCancel();
      }
    });
  }

  /*点击编辑*/
  editCardInfo(index){
    this.contractBool = false;
    $('.form-add').attr('disabled',false);
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('编辑党建实践案例');
    this.newCard = JSON.parse(JSON.stringify(this.recordList[index]));
    this.newCard.type = '4';
    this.newCard.fileName = [];
    this.newCard.filePath = [];
    if(this.newCard.fileContract){
      for(let i=0;i<this.newCard.fileContract.length;i++){
        this.newCard.fileName.push(this.newCard.fileContract[i].fileName);
        this.newCard.filePath.push(this.newCard.fileContract[i].filePath);
      }
    }
  }

  /*编辑删除附件*/
  delFile(index) {
    this.newCard.filePath.splice(index,1);
    this.newCard.fileName.splice(index,1);
  }

  /*点击删除*/
  delCardInfo(id){
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let url = '/building/parking/deleteParkingPermitInfo/'+id;
        this.ipSetting.sendGet(url).subscribe(data => {
          if(this.errorVoid.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示' ,
              'mes': data['msg'],
              'popType': 0 ,
              'imgType': 1 ,
            });
            this.repairSearch(1);
          }
        });
      }
    });
  }

  /*取消*/
  addCancel(){
    $('.mask,.mask1,.mask2').fadeOut();
    $('.errorMessage').html('');
  }

  /*新增校验*/
  public verifybranchName(){
    if (!this.isEmpty('branchName', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifymonth(){
    if(!this.isEmpty('month', '不能为空')){
      return false;
    }
    return true;
  }
  public verifyanlitype(){
    if (!this.isEmpty('anlitype', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifycaseName(){
    if (!this.isEmpty('caseName', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifycaseNote(){
    if (!this.isEmpty('caseNote', '不能为空')) {
      return false;
    }
    return true;
  }
  /**非空校验*/
  public isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if(data === null){
      this.addErrorClass(id, error);
      return false;
    }else{
      if (data.toString().trim() === '')  {
        this.addErrorClass(id, error);
        return false;
      }else {
        this.removeErrorClass(id);
        return true;
      }
    }
  }
  /** 添加错误信息class */
  public  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-inp').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('span').html('输入错误');
    }else {
      $('#' + id).next('span').html(error);
    }
  }
  /**去除错误信息class */
  public  removeErrorClass(id: string) {
    $('#' + id).parents('.form-inp').removeClass('form-error');
    $('#' + id).parents('.form-inp').children('.errorMessage').html('');
  }
}
export class CardInfo {
  id: number; // 本条信息ID
  branchName:string; // 支部名称
  type:string; // 党建类型
  subType:string; /*案例类型*/
  month: string;// 月份
  createUserId:string;
  note: string;// 案例概述
  theme:string; /*案例名称*/
  fileContract:any; /*存放附件信息*/
  fileName=[];
  filePath=[];
}
