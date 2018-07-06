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
  providers:[sndCatalog],
})
export class ListComponent implements OnInit {
  public newCard = new CardInfo();
  public secondCard = new CardInfo();

  public mode = '0';
  public proposal = [];
  public pageSize = 15;
  public pageNo = 1;
  public total = 0;
  public length = 10;
  public searchInfo = new SearchInfo();
  public record:any;
  public recordChoose:any;
  private contractBool = true;
  public repairDept=[];
  public rule;
  public catas;
  constructor(
    public http:Http,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
  ) {
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("工会管理/提案信息管理");
    this.getRule();
    this.searchInfo.type = '';
    // this.searchInfo.createUserId = localStorage.getItem("username");
    this.repairSearch(1);
    this.repairWait();
    this.getRepairDept();
    this.proposal = [{id:1,name:'提案1'},{id:2,name:'提案2'},{id:3,name:'提案3'},]
  }
  /*查询*/
  repairSearch(num){
    let url = '/soclaty/flow/getSoclatyFlowList/'+num+'/'+this.pageSize;
    this.ipSetting.sendPost(url,this.searchInfo).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.record = data.data.infos;
        this.total = data.data.total;
      }
    });
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'unions','unions/congress/list')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.catas = data.data[0];
          /*for(let i = 0;i<this.catas.length;i++){
            if(this.catas[i].routeUrl === "employ/group"){
              this.catas.splice(i,1);
              i = 0;
            }
            if(this.catas[i].routeUrl === "employ/group/product"){
              this.rule = this.catas[i];
            }
          }*/
        }
      })
  }
  /*获取待审提案*/
  repairWait(){
    let url = '/soclaty/flow/getSoclatyFlowList/1/9999';
    let postData = {
      isFound:'pending'
    };
    this.ipSetting.sendPost(url,postData).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.recordChoose = data.data.infos;
      }
    });
  }
  /*获取部门列表*/
  getRepairDept(){
    let url = '/portal/user/getDeptList';
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        // console.log(data.data);
        this.repairDept = data.data;
        for(let i = 0;i<this.repairDept.length;i++){
          this.repairDept[i].choose = false;
        }
      }
    });
  };
  /*立案操作*/
  editCardInfo(index){
    $('.mask').fadeIn();
    // this.newCard = JSON.parse(JSON.stringify(this.record[index]));
    this.newCard = new CardInfo();
    this.newCard.fatherId = index;
    for(let i = 0;i<this.repairDept.length;i++){
      this.repairDept[i].choose = false;
    }
  }

  /*不立案操作*/
  delCardInfo(index){
    $('.mask1').fadeIn();
    this.secondCard = new CardInfo();
    this.secondCard.fatherId = index;
    for(let i = 0;i<this.repairDept.length;i++){
      this.repairDept[i].choose = false;
    }

  }
  /*点击新增*/
  addVehicle(){
    this.newCard = new CardInfo();
    $('.mask').fadeIn();
  }
  /*新增校验*/
  public verifynewtype(){
    if (!this.isEmpty('newtype', '不能为空')) {
      return false;
    }
    return true;
  }
  /*新增校验*/
  public verifysecondtype(){
    if (!this.isEmpty('secondtype', '不能为空')) {
      return false;
    }
    return true;
  }
  /*选择主办部门*/
  changeDept(){
    for(let i = 0;i<this.repairDept.length;i++){
      if(this.repairDept[i].DEPT_ID === this.newCard.hostDeptId){
        this.newCard.hostDeptName = this.repairDept[i].DEPT_NAME;
      }
      if(this.repairDept[i].DEPT_ID === this.secondCard.hostDeptId){
        this.secondCard.hostDeptName = this.repairDept[i].DEPT_NAME;
      }
    }
  }
  /*选取协办部门*/
  chooseDept(){
    this.newCard.helpDeptId = '';
    this.newCard.helpDeptName = '';
    for(let i = 0;i<this.repairDept.length;i++){
      if(this.repairDept[i].choose){
        this.newCard.helpDeptId += this.repairDept[i].DEPT_ID+',';
        this.newCard.helpDeptName += this.repairDept[i].DEPT_NAME+',';
      }
    }
  }
  subDept(){
    $('#deptSltWin').fadeOut();
  }
  submit(){
    let list = document.getElementsByName("vice");
    let str = [];
    for(let i = 0;i<list.length;i++){
      if(list[i]['checked']){
        str.push(list[i]['value']);
      }
    }
    this.newCard.children = str.join(',');
    let url = "/soclaty/flow/checkHead?fatherId="+this.newCard.fatherId+"&&children="+this.newCard.children;
    if(this.mode === '0'){
      if(this.newCard.children.length<1){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '合并立案下，附议提案不能为空！',
          'popType': 0 ,
          'imgType': 2,
        });
        return false;
      }
    }else{
      this.newCard.children = '';
    }
    // this.postData.handleUserId = str.join(',');
    if (!this.verifynewtype()) {
      return false;
    }
    let postData = {
      "soclatyFlow": {
        "hostDeptName": this.newCard.hostDeptName,
        "hostDeptId": this.newCard.hostDeptId,
        "helpDeptName": this.newCard.helpDeptName,
        "helpDeptId": this.newCard.helpDeptId,
      },
      "flowNode": {
        "result": "pass"
      }
    };
    // JSON.parse(JSON.stringify(this.newCard));
    // console.log(postData);
    this.ipSetting.sendPost(url, postData).subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        confirmFunc.init({
          'title': '提示' ,
          'mes': data.msg,
          'popType': 0 ,
          'imgType': 1 ,
        });
        this.repairSearch(1);
        this.addCancel();
      }
    });
  }
  /*不立案提交*/
  submitNo(){
    if(!this.verifysecondtype()){
      return false;
    }
    let url = "/soclaty/flow/checkHead?fatherId="+this.secondCard.fatherId+"&&children=";
    let postData = {
      "soclatyFlow": {
        "hostDeptName": this.secondCard.hostDeptName,
        "hostDeptId": this.secondCard.hostDeptId,
      },
      "flowNode": {
        "result": "disagree"
      }
    };
    // JSON.parse(JSON.stringify(this.newCard));
    // console.log(postData);
    this.ipSetting.sendPost(url, postData).subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        confirmFunc.init({
          'title': '提示' ,
          'mes': data.msg,
          'popType': 0 ,
          'imgType': 1 ,
        });
        this.repairSearch(1);
        this.addCancel();
      }
    });
  }
  /*取消*/
  addCancel(){
    $('.mask,.mask1,.mask2').fadeOut();
    this.subDept();
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
  fatherId: number; // 主提案
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
