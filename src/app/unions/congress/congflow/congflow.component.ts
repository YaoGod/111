import { Component, OnInit } from '@angular/core';
import {sndCatalog} from "../../../mode/catalog/catalog.service";
import {Http} from "@angular/http";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../../service/user-portal/user-portal.service";
import {GlobalUserService} from "../../../service/global-user/global-user.service";

declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-congflow',
  templateUrl: './congflow.component.html',
  styleUrls: ['./congflow.component.css'],
  providers:[UserPortalService,sndCatalog],
})
export class CongflowComponent implements OnInit {

  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  public searchInfo = new SearchInfo();
  public record:any;
  public newCard = new SearchInfo();
  public resultSubmit: ResultSubmit;
  public rule : sndCatalog = new sndCatalog();
  public deptList:Array<any>;
  public deptUserList:Array<any>;
  public isEdit = false;
  public flowNameList = [
    "流程开始","提案人发起","提案审查委员会主任审批","工会主席审批","总经理审批","部门正职审批",
    "指定反馈人反馈","部门正职审批","提案人满意度评价","结束"];
  public userId;
  public plFlag = false;
  constructor(
    public http:Http,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
    private userPortalService:UserPortalService,
    private globalUserService:GlobalUserService
  ) {
    this.rule = this.globalCatalogService.getRole("unions/congress");
  }
  ngOnInit() {
    this.globalCatalogService.setTitle("工会管理/工单流程管理");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("unions/congress");
      }
    );
    this.userId = this.globalUserService.getVal().userid;
    this.newCard.planContent = new RequestContent();
    this.newCard.hangdleContent = new RequestContent();
    this.searchInfo.fatherId = "-1";
    this.searchInfo.type = "";
    this.searchInfo.hostDeptId = "";
    this.searchInfo.helpDeptId = "";
    this.searchInfo.dataType = "pending";
    this.resultSubmit = new ResultSubmit();
    this.repairSearch(1);
    this.getDeptList();
  }
  /*部门列表*/
  getDeptList(){
    this.userPortalService.getDeptList()
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.deptList = data.data;
        }
      })
  }
  /*主办部门人员列表*/
  getHostDeptUserList(id){
    let dept = {
      deptId: id
    };
    this.userPortalService.getDeptUserList(1,dept)
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.deptUserList = data.data;
        }
      })
  }
  /*查询*/
  repairSearch(num){
    this.pageNo = num;
    if(this.searchInfo.dataType === "past"){
      this.searchInfo.isFound = null;
    }else {
      this.searchInfo.isFound = "success,disagree";
    }
    let url = '/soclaty/flow/getSoclatyFlowList/'+num+'/'+this.pageSize;
    this.ipSetting.sendPost(url,this.searchInfo).subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        this.record = data.data.infos;
        this.total = data.data.total;
      }
    });
  }
  /*点击审核*/
  addVehicle(inner: SearchInfo){
    this.newCard = JSON.parse(JSON.stringify(inner));
    this.newCard.hostDeptId = inner.hostDeptId?inner.hostDeptId:"";
    this.newCard.helpDeptId = this.newCard.helpDeptId!==null?this.newCard.helpDeptId.split(","):[];
    this.newCard.helpDeptName = this.newCard.helpDeptName!==null?this.newCard.helpDeptName.split(","):[];
    this.newCard.planContent = new RequestContent();
    this.newCard.hangdleContent = new RequestContent();
    if(this.newCard.helpDeptId[this.newCard.helpDeptId.length-1]===","){
      this.newCard.helpDeptId.pop();
      this.newCard.helpDeptName.pop();
    }
    this.resultSubmit = new ResultSubmit();
    this.resultSubmit.result = "";
    this.resultSubmit.content = "";
    if(this.newCard.schedule === 3||this.newCard.schedule === 4){
      this.isEdit = true;
    }
    if(this.newCard.schedule === 5){
      this.isEdit = true;
      this.newCard.handleId = "";
      this.getHostDeptUserList(this.newCard.hostDeptId);
      if(this.newCard.previousSchedule === 6){
        // 实际是第七步骤
        this.getOrderDetail(this.newCard.id);
      }else if(this.newCard.previousSchedule === 2){
        this.isEdit = false;
      }
    }
    if(this.newCard.schedule === 6){
      this.getOrderDetail(this.newCard.id);
      $('#shishi').fadeIn();
    }
    else if(this.newCard.schedule === 8){
      this.resultSubmit.satisfled = "";
      $('#fankui').fadeIn();
    }
    else{
      $('#shenpi').fadeIn();
    }
  }
  /*新增校验*/
  public verifyEmpty(id){
    if (!this.isEmpty(id, '不能为空')) {
      return false;
    }
    return true;
  }
  /*设置意见*/
  setResultContent(){
    if(typeof (this.resultSubmit.content)==="undefined"||this.resultSubmit.content === ""||
      this.resultSubmit.content === "同意"||this.resultSubmit.content === "驳回"){
      this.resultSubmit.content = this.resultSubmit.result==="pass"?"同意":"驳回";
    }
    if(this.resultSubmit.result === "fail"){
      this.removeErrorClass("newHandleId");
      this.newCard.handleId = "";
    }
  }
  /*设置指定人员*/
  sethandleUser(id){
    this.newCard.handleId = "";
    this.getHostDeptUserList(id);
  }
  submit(){
    if(this.newCard.schedule === 3||this.newCard.schedule === 4|| this.newCard.schedule === 5){
      if(this.newCard.schedule === 3||this.newCard.schedule === 5){
        if(!this.verifyEmpty('newDeptId')){
          return false;
        }
      }
      if (this.resultSubmit.result === "") {
        this.addErrorClass("newResult", "请选择审核决策");
        return false;
      } else {
        this.removeErrorClass("newResult");
      }
      if(this.newCard.previousSchedule === 4&&this.newCard.schedule === 5&&this.resultSubmit.result === 'pass'){
        if(!this.verifyEmpty('newHandleId')){
          return false;
        }
      }
      if (!this.verifyEmpty('newContent')) {
        return false;
      }
    }
    if(this.newCard.schedule === 6){
      if (this.newCard.isFound==="立案"&&!this.verifyEmpty('newPlanEndTime')) {
        return false;
      }
      if (this.newCard.isFound==="立案"&&this.isEdit) {
        if(!this.verifyEmpty('newHandleEndTime')){
          return false;
          }
      }
      if (this.newCard.isFound==="不同意") {
        if(!this.verifyEmpty('newHandleContentResult')){
          return false;
        }
      }
    }
    if(this.newCard.schedule === 8){
      console.log(this.resultSubmit);
      if (this.resultSubmit.satisfled === "") {
        this.addErrorClass("newCreateSatisfled", "请选择满意度");
        return false;
      } else {
        this.removeErrorClass("newCreateSatisfled");
      }
      if (!this.verifyEmpty('newCreateUserAssess')) {
        return false;
      }
    }
    let url = "";
    let postData;
    let soclatyFlow = JSON.parse(JSON.stringify(this.newCard));
    let flowNode = JSON.parse(JSON.stringify(this.resultSubmit));
    if(typeof (soclatyFlow.helpDeptId)!=="undefined"){
      soclatyFlow.helpDeptId = soclatyFlow.helpDeptId.join(",");
      soclatyFlow.helpDeptName = soclatyFlow.helpDeptName.join(",");
    }
    postData = {
      "soclatyFlow": soclatyFlow,
      "flowNode": flowNode
    };
    switch (this.newCard.schedule) {
      case 3:
        url = "/soclaty/flow/checkManage";
        break;
      case 4:
        if(!this.plFlag){
          url = "/soclaty/flow/checkManage";
        }else{
          // 总经理批量审批
          let temps = $("input[name='rSelect']:checked");
          let tempID = [];
          for(let i = 0;i < temps.length;i++){
            tempID.push(temps[i].value);
          }
          url = "/soclaty/flow/checkManageBatch?ids="+tempID.join(",");
          postData = flowNode;
        }
        break;
      case 5:
        url = "/soclaty/flow/checkDeptBoss";
        break;
      case 6:
        url = "/soclaty/flow/submit/"+this.newCard.id;
        postData = {
          "plan": this.newCard.planContent,
          "handle": this.newCard.hangdleContent
        };
        break;
      case 7:
        url = "/soclaty/flow/checkDeptBoss";
        break;
      case 8:
        url = "/soclaty/flow/endFlow/"+this.newCard.id;
        postData = flowNode;
        break;
    }
    this.ipSetting.sendPost(url, postData)
      .subscribe(data => {
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
    $('.mask').fadeOut();
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
    let currentdate = date.getFullYear() + seperator1 + num;
    return currentdate;
  }
  /**非空校验*/
  public isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if(typeof (data)==="undefined"|| data === null){
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
  public  addErrorClass(id: string, error?: string){
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
  /*打开部门选择框*/
  openChooseWin(){
    if(this.isEdit){
      $('#deptSltWin').show();
      for(let i = 0;i<this.deptList.length;i++){
        this.deptList[i].choose = false;
        for(let j = 0 ;j<this.newCard.helpDeptId.length;j++){
          if(this.deptList[i].DEPT_ID === this.newCard.helpDeptId[j]){
            this.deptList[i].choose = true;
          }
        }
      }
    }

  }
  /*选取部门*/
  chooseDept(index) {
    this.newCard.helpDeptId = [];
    this.newCard.helpDeptName = [];
    for (let i = 0; i < this.deptList.length; i++) {
      if (this.deptList[i].choose) {
        this.newCard.helpDeptId.push(this.deptList[i].DEPT_ID);
        this.newCard.helpDeptName.push(this.deptList[i].DEPT_NAME);
      }
    }
  }
  getOrderDetail(id){
    let url = "/soclaty/flow/getSoclatyFlowInfo/"+id;
    this.ipSetting.sendGet(url)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          this.newCard.planContent = data.data.planContent;
          this.newCard.hangdleContent = data.data.hangdleContent;
          this.newCard.planContent.beginTime = this.newCard.planContent.beginTime!==null
            ?this.newCard.planContent.beginTime.replace(" ","T"):"";
          this.newCard.planContent.endTime = this.newCard.planContent.endTime!==null
            ?this.newCard.planContent.endTime.replace(" ","T"):"";
          this.newCard.hangdleContent.endTime = this.newCard.hangdleContent.endTime!==null
            ?this.newCard.hangdleContent.endTime.replace(" ","T"):"";
          if(typeof (this.newCard.planContent.endTime)==="undefined"||
            this.newCard.planContent.endTime===null|| this.newCard.planContent.endTime===""){
            this.isEdit = false;
          }else{
            this.isEdit = true;
            if(this.newCard.previousSchedule === 6&&this.newCard.schedule === 5){
              this.isEdit = false;
            }
          }
        }
      });
  }
  piliangCheck(){
    let temps = $("input[name='rSelect']:checked");
    if(temps.length>0){
      this.plFlag = true;
      this.newCard = new SearchInfo();
      this.newCard.schedule = 4;
      this.resultSubmit = new ResultSubmit();
      this.resultSubmit.result = "";
      this.resultSubmit.content = "";
      $('#shenpi').fadeIn();
    }else {
      this.plFlag = false;
    }
  }
}
export class SearchInfo {
  id: number; // 本条信息ID
  bTime:string;
  cause:string;
  children:Array<any>;
  code: string;
  content:string;
  satisfled:string;
  createTime:string;
  createUserAssess: Array<any>;
  createUserDept:string;
  createUserId:string;
  createUserName:string;
  deptBoss:string;
  deptId:string;
  eTime:string;
  endTime:string;
  fatherId:string;
  handleId:string;
  handleName:string;
  handleUrl:string;
  handleUserAll:string;
  handleUserId:string;
  handleUserName:string;
  hangdleContent:RequestContent;
  helpDeptId:any;
  helpDeptName:any;
  hostDeptId:string;
  hostDeptName:string;
  isFound:string;
  joinDate:string;
  modifyTime:string;
  modifyUserId:string;
  name:string;
  note:string;
  opinionContent:Array<any>;
  planContent:RequestContent;
  previousSchedule:any;
  previousUserId:string;
  schedule:any;
  sex:string;
  status:string;
  suggest:string;
  theme:string;
  type:string;
  userAge:string;
  userCultural:string;
  userDept:string;
  userMemver:string;
  userName:string;
  userPolitical:string;
  userWork:string;
  dataType: string;
  filePath:Array<string>;
  fileName:Array<string>;
}
export class ResultSubmit {
  content: string;
  result: string;
  userId: string;
  userName: string;
  userGroup: string;
  createTime: string;
  type: string;
  satisfled: string
  userAssess:string;
}
export class RequestContent{
  content: string;
  beginTime: string;
  endTime: string;
  createUserName:string;
}
