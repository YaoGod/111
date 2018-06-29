import { Component, OnInit } from '@angular/core';
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {sndCatalog} from "../../../mode/catalog/catalog.service";
import {Http} from "@angular/http";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";

declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers:[UtilBuildingService,sndCatalog],
})
export class ListComponent implements OnInit {
  public newCard = new CardInfo();
  public mode = '0';
  public proposal = [];
  public pageSize = 15;
  public pageNo = 1;
  public total = 0;
  public length = 10;
  public searchInfo = new SearchInfo();
  public record:any;
  private contractBool = true;
  public repairDept=[];
  public rule : sndCatalog = new sndCatalog();
  constructor(
    public http:Http,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
    private utilBuildingService:UtilBuildingService,
  ) {
    this.rule = this.globalCatalogService.getRole("party/upload");
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("工会管理/职代会发起记录");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("party/upload");
      }
    );
    this.searchInfo.type = '';
    // this.searchInfo.createUserId = localStorage.getItem("username");
    this.repairSearch(1);
    this.getRepairDept();
    this.proposal = [{id:1,name:'提案1'},{id:2,name:'提案2'},{id:3,name:'提案3'},]
  }
  /*查询*/
  repairSearch(num){
    let url = '/soclaty/flow/getSoclatyFlowList/'+num+'/'+this.pageSize;
    this.ipSetting.sendPost(url,this.searchInfo).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        console.log(data.data);
        this.record = data.data.infos;
        this.total = data.data.total;
      }
    });
  }
  /*获取部门列表*/
  getRepairDept(){
    let url = '/party/report/getDeptList';
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        console.log(data.data);
        this.repairDept = data.data;
      }
    });
  };
  /*立案操作*/
  editCardInfo(index){
    $('.mask').fadeIn();
    this.newCard = JSON.parse(JSON.stringify(this.record[index]));

  }

  /*不立案操作*/
  delCardInfo(id){

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
  /*点击新增*/
  addVehicle(){
    this.newCard = new CardInfo();
    $('.mask').fadeIn();
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
  type: string; // 类型
  fatherId: string; // 主提案
  children: string; // 附议提案
  hostDeptName:string; // 主办部门名字
  hostDeptId:string; // 主办部门ID
  helpDeptName:string; // 协办部门名字
  helpDeptId:string; // 协办部门ID
  createUserId:string;

}
export class SearchInfo {
  id: number; // 本条信息ID
  type: string; // 类型
  bTime: string; // 开始时间
  eTime: string; // 结束时间
  createUserId:string; //
}
