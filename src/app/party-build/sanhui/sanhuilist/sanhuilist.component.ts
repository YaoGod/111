import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {SaleProductEmployeeService} from "../../../service/sale-product-employee/sale-product-employee.service";
declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-sanhuilist',
  templateUrl: './sanhuilist.component.html',
  styleUrls: ['./sanhuilist.component.css'],
  providers:[UtilBuildingService,SaleProductEmployeeService],
})
export class SanhuilistComponent implements OnInit {
  public newCard = new CardInfo();
  public buildings:Array<any>;
  public pageSize = 15;
  public pageNo = 1;
  public total = 0;
  public length = 10;
  public searchInfo = new SearchInfo();
  public record:any;
  private contractBool = true;
  public repairDept=[];
  constructor(
    public http:Http,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
    private utilBuildingService:UtilBuildingService,
    private saleProductEmployeeService:SaleProductEmployeeService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("党建管理/工作台账上传");
    this.searchInfo.type = '1';
    this.searchInfo.branchName = '';
    this.searchInfo.subType = '';
    this.repairSearch(1);
    this.getRepairDept();

  }
  /*查询*/
  repairSearch(num){
    let url = '/party/report/getList/'+num+'/'+this.pageSize;
    this.ipSetting.sendPost(url,this.searchInfo).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.record = data.data.list;
        this.total = data.data.total;
      }
    });
  }

  /*点击编辑*/
  editCardInfo(index){
    this.contractBool = false;
    $('.form-add').attr('disabled',false);
    // $('.form-disable').attr('disabled',true).css('backgroundColor','#f8f8f8');
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('编辑会议记录');
    this.newCard = JSON.parse(JSON.stringify(this.record[index]));
    this.newCard.fileName = [];
    this.newCard.filePath = [];
    if(this.newCard.fileContract){
      for(let i=0;i<this.newCard.fileContract.length;i++){
        this.newCard.fileName.push(this.newCard.fileContract[i].fileName);
        this.newCard.filePath.push(this.newCard.fileContract[i].filePath);
      }
    }
    // console.log(this.newCard);
  }
  /*点击删除*/
  delCardInfo(id){
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let url = '/party/report/delete/'+id;
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
  /*获取部门列表*/
  getRepairDept(){
    this.saleProductEmployeeService.getDeptList().subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.repairDept = data.data;
      }
    });
  };
  /*点击新增*/
  addVehicle(){
    this.contractBool = true;
    $('.form-disable').attr('disabled',false).css('backgroundColor','#fff');
    this.newCard = new CardInfo();
    this.newCard.branchName = '';
    this.newCard.type = '1';
    this.newCard.subType = '';
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('新增会议记录');
  }
  /*新增校验*/
  public verifybranchName(){
    if (!this.isEmpty('branchName', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifynewtype(){
    if(!this.isEmpty('newtype', '不能为空')){
      return false;
    }
    return true;
  }
  public verifybTime(){
    if (!this.isEmpty('bTime', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyeTime(){
    if (!this.isEmpty('eTime', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyhost(){
    if (!this.isEmpty('host', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyaddress(){
    if (!this.isEmpty('address', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyrecorder(){
    if (!this.isEmpty('recorder', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyshouldNum(){
    if (!this.isEmpty('shouldNum', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyfactNum(){
    if (!this.isEmpty('factNum', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifytheme(){
    if (!this.isEmpty('theme', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifynote(){
    if (!this.isEmpty('repairNote', '不能为空')) {
      return false;
    }
    return true;
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
  /*删除合同文件*/
  delFile(index) {
    this.newCard.filePath.splice(index,1);
    this.newCard.fileName.splice(index,1);
  }
  submit(){
    var url;
    if(this.contractBool === false){
      url = "/party/update/updateThreeOne";
    }else{
      url = "/party/add/addThreeOne";
    }
    if (!this.verifybranchName()||!this.verifynewtype()||!this.verifybTime()||!this.verifyeTime()||!this.verifyhost()||
    !this.verifyaddress()||!this.verifyrecorder()||!this.verifyshouldNum()||!this.verifyfactNum()||!this.verifytheme()||
      !this.verifynote()) {
      return false;
    }
    let postData = JSON.parse(JSON.stringify(this.newCard));
    postData.month = this.newCard.beginTime.substring(0, 7);
    /*this.getNowFormatDate(); 018-06-09T10:00*/
    /*postData.beginTime = postData.beginTime.replace("T"," ");*/
    if(postData.filePath && postData.filePath.length>0){
      this.ipSetting.sendPost(url, postData).subscribe(data => {
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
    }else{
      confirmFunc.init({
        'title': '提示' ,
        'mes': '请上传附件内容！',
        'popType': 0 ,
        'imgType': 2,
      });
      return false;
    }

  }
  /*取消*/
  addCancel(){
    $('.mask,.mask1,.mask2').fadeOut();
    $('.errorMessage').html('');
  }
  private getNowFormatDate() {
    let date = new Date();
    let seperator1 = "-";
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    let num = String(month);
    if (month >= 1 && month <= 9) {
      num = "0" + month;
    }
    /*if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }*/
    let currentdate = date.getFullYear() + seperator1 + num;
    return currentdate;
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
  type:string; // 会议类型(三会一课同级)
  subType:string; // 子类型
  month: string;// 月份
  name:string; // 文件名称
  beginTime:string; // 开始时间
  endTime:string; // 结束时间
  host:string; // 主持人
  recorder:string; // 记录人
  shouldNum:number; // 应到人数
  factNum:number; // 实到人数
  absentNum:number; // 缺席人数
  reason:string; // 缺席原因
  theme:string; // 会议主题
  note:string; // 会议议程
  address:string; // 会议地点
  fileName=[];
  filePath=[];
  fileContract:any;
}
export class SearchInfo {
  id: number; // 本条信息ID
  branchName:string; // 支部名称
  type:string; // 会议类型(三会一课同级)
  subType:string; // 子类型
  month: string;// 月份
  name:string; // 文件名称
  beginTime:string; // 开始时间
  endTime:string; // 结束时间
  host:string; // 主持人
  recorder:string; // 记录人
  shouldNum:number; // 应到人数
  factNum:number; // 实到人数
  absentNum:number; // 缺席人数
  reason:string; // 缺席原因
  theme:string; // 会议主题
  note:string; // 会议议程
  address:string; // 会议地点
}
