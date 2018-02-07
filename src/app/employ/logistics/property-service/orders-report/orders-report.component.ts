import { Component, OnInit } from '@angular/core';
import {InfoBuildingService} from "../../../../service/info-building/info-building.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {UtilBuildingService} from "../../../../service/util-building/util-building.service";
import {Http, RequestOptions, Headers} from "@angular/http";
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";

declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-orders-report',
  templateUrl: './orders-report.component.html',
  styleUrls: ['./orders-report.component.css'],
  providers: [InfoBuildingService,ErrorResponseService,UtilBuildingService]
})
export class OrdersReportComponent implements OnInit {
  public searchArch : Arch;
  public record: Array<GuardName>;
  public repairname: GuardName;
  public pages: Array<number>;
  public buildings: any;
  public rule : any;
  public jurisdiction:any;
  public pageSize = 6;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  private editBool = true;
  public floorNames   : Array<any>; /*大楼楼层名称列表*/
  public pin:string;
  public aot:string[];
  public URL: string;
  public repairDept :any;

  constructor(private http: Http,
              private errorVoid:ErrorResponseService,
              private utilBuildingService:UtilBuildingService,
              private infoBuildingService:InfoBuildingService,
              private globalCatalogService:GlobalCatalogService,
              public ipSetting  : IpSettingService
  ) {
    this.rule = this.globalCatalogService.getRole("property/orders");
  }

  ngOnInit() {
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("property/orders");
        this.getQuan();
      }
    );
    this.URL = this.ipSetting.ip;
    this.searchArch = new Arch();
    this.repairname = new GuardName();
    this.pages = [];
    this.repairname.fileName = [];
    this.repairname.filePath = [];
    this.getBuildings();
    this.getRepairDept();
    this.getRecord(this.searchArch, this.pageNo, this.pageSize);

  }

  /*获取权限*/
  private getQuan(){
    if(this.rule!=null){
      let SOFTWARES_URL =  "/portal/user/getCata/"+this.rule.ID+"/repair?url=";
      this.ipSetting.sendGet(SOFTWARES_URL).subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.jurisdiction = data['data'][0];
        }
      });
    }
  }
  /*获取大楼列表*/
  private getBuildings() {
    this.utilBuildingService.getBuildingList('')
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.buildings = data['data'];
        }
      })
  }
  /*获取楼层名称*/
  getFloorNameListInfo(id:string) {
    this.infoBuildingService.getFloorNameListMsg(Number(id))
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.floorNames = data.data;
        }
      });
  }
  /*获取维修部门列表*/
  getRepairDept(){
    let url = '/building/repair/getRepairDept'
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.repairDept = data.data;
      }
    });
  };
  /*获取/查询物业服务订单*/
  private getRecord(search, pageNo, pageSize) {
    if((typeof search.buildingNum) === 'undefined'){
      search.buildingNum = '';
    }
    if((typeof search.buildingName) === 'undefined'){
      search.buildingName = '';
    }
    if((typeof search.orderId) === 'undefined'){
      search.orderId = '';
    }
    if((typeof search.orderStatus) === 'undefined'){
      search.orderStatus = '';
    }
    if((typeof search.startTime) === 'undefined'){
      search.startTime = '';
    }
    if((typeof search.finshTime) === 'undefined'){
      search.finshTime = '';
    }
    if((typeof search.serverUserid) === 'undefined'){
      search.serverUserid = '';
    }
    if((typeof search.userDept) === 'undefined'){
      search.userDept = '';
    }

    let SOFTWARES_URL = "/employee/property/getOrder/list/" + pageNo + "/" + pageSize+"?buildingNum="+
      search.buildingNum+"&buildingName="+search.buildingName+"&orderId="+search.orderId+"&orderStatus="+
      search.orderStatus+"&startTime="+search.startTime+"&finshTime="+search.finshTime+"&serverUserid="+search.serverUserid+
      "&userDept="+search.userDept;
    this.ipSetting.sendGet(SOFTWARES_URL).subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.record = data['data']['infos'];
          this.total = data.data.total;
        }
      });
  }
  /*点击查询*/
  repairSearch(){
    this.getRecord(this.searchArch, this.pageNo, this.pageSize)
  }
  /*删除信息*/
  delAttach(){  }
  /*获取人员下拉*/
  public getPersonInfoList() {
    if(this.repairname.porpertyId==0){
      this.pin = 'clean';
    }else if(this.repairname.porpertyId==1){
      this.pin = 'repair';
    }else if(this.repairname.porpertyId==2){
      this.pin = 'clean';
    }
    let url = "/building/person/getPersonInfoList/"+this.pin;
    this.ipSetting.sendGet(url)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.aot = data['data'];
          // console.log(data)
        }
      });
  }
  /*编辑信息*/
  editAttach(index){
    this.editBool = false;
    this.repairname = JSON.parse(JSON.stringify(this.record[index]));
    this.getPersonInfoList();
    this.getFloorNameListInfo(this.repairname.buildingId);
    if(this.repairname.orderStatus === '已执行'){
      this.repairname.orderStatus = '2';
    }else if(this.repairname.orderStatus === '结单'){
      this.repairname.orderStatus = '4';
    }if(this.repairname.orderStatus === '退单'){
      this.repairname.orderStatus = '3';
    }
    $('.mask').fadeIn();
    $('.mask-head p').html('物业订单审批');
  }

  /*合同信息校验*/
  public verifybuildingId() {
    if (!this.isEmpty('buildingId', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyservername() {
    if (!this.isEmpty('servername', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyexam() {
    if (!this.isEmpty('exam', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifydetail() {
    if (!this.isEmpty('liableNote', '不能为空')) {
      return false;
    }
    return true;
  }
  /*附件上传*/
  prese_upload(files){
    var xhr = this.utilBuildingService.importEmployee(files[0],'property',-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data.status)){
          this.repairname.fileName.push(files[0].name);
          this.repairname.filePath.push(data.msg);
          confirmFunc.init({
            'title': '提示' ,
            'mes': '上传成功',
            'popType': 0 ,
            'imgType': 1,
          });
          $('#prese').val('');
        }
      }else if(xhr.readyState === 4 && xhr.status === 413){
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
  delFile(index){
    this.repairname.filePath.splice(index,1);
    this.repairname.fileName.splice(index,1);
  }
  /*新增/编辑信息提交*/
  contractSubmit() {
    let url;
    if(this.editBool === false){
      url = "/employee/property/updateOrder";
    }else{
      url = "/employee/property/addOrder";
    }
    if (!this.verifybuildingId() || !this.verifyservername() || !this.verifydetail() || !this.verifyexam()) {
      return false;
    }
    this.ipSetting.sendPost(url, this.repairname).subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          confirmFunc.init({
            'title': '提示' ,
            'mes': this.editBool === false?'更改成功':'新增成功',
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.getRecord(this.searchArch, this.pageNo, this.pageSize);
          this.contractCancel();
        }
      });
  }
  contractCancel(){
    this.repairname = new GuardName();
    $('.form-control').removeClass('form-error');
    $('.errorMessage').html('');
    this.repairname.fileName = [];
    this.repairname.filePath = [];
    $('.mask').hide();
  }

  /*点击导出*/
  outOrder(){
    $('#deriving').fadeIn();
  }
  /*关闭导出对话框*/
  public closeDeriving() {
    $('#deriving').hide();
  }
  /*导出数据下载*/
  public downDeriving(){
    if((typeof this.searchArch.startTime) === 'undefined' || (typeof this.searchArch.finshTime) === 'undefined'){
      this.searchArch.startTime = '';
      this.searchArch.finshTime = '';
    }
    this.searchArch.startTime = this.searchArch.startTime.replace(/-/g, "/");
    this.searchArch.finshTime = this.searchArch.finshTime.replace(/-/g, "/");
    this.http.get(this.ipSetting.ip + "/employee/property/getOrder/excel/"+ this.pageNo +"/"+ this.pageSize +"?buildingNum="+
      this.searchArch.buildingNum+"&buildingName="+this.searchArch.buildingName+"&orderId="+this.searchArch.orderId+
      "&orderStatus="+ this.searchArch.orderStatus+"&startTime="+this.searchArch.startTime+"&finshTime="+
      this.searchArch.finshTime+"&serverUserid="+this.searchArch.serverUserid+ "&userDept="+this.searchArch.userDept)
    // .map(res => res.json())
      .subscribe(data => {
        window.location.href = this.ipSetting.ip + "/employee/property/getOrder/excel/"+ this.pageNo +"/"+ this.pageSize +"?buildingNum="+
          this.searchArch.buildingNum+"&buildingName="+this.searchArch.buildingName+"&orderId="+this.searchArch.orderId+
          "&orderStatus="+ this.searchArch.orderStatus+"&startTime="+this.searchArch.startTime+"&finshTime="+
          this.searchArch.finshTime+"&serverUserid="+this.searchArch.serverUserid+ "&userDept="+this.searchArch.userDept;
        this.searchArch = new Arch();
        $('#deriving').fadeOut();
      });
  }
  /*跳页加载数据*/
  goPage(page:number) {
    this.pageNo = page;
    this.getRecord(this.searchArch, this.pageNo, this.pageSize);
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
  /** 匹配数字 */
  public verifyIsNumber(id: string, error: string): boolean  {
    const data =  $('#' + id).val();// /^[0-9]*$/
    if (!String(data).match(/^[0-9]*$/))  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /**验证手机号码   */
  public verifyIsTel(id: string, error?: string): boolean {
    const data =  $('#' + id).val();
    if (!String(data).match( /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/ )){
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /**校验字符长度小于8 */
  public verifyLength8(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if (data.length < 8)  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /** 添加错误信息class   */
  public  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-control').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('span').html('输入错误');
    }else {
      $('#' + id).next('span').html(error);
    }
  }
  /** 去除错误信息class */
  public  removeErrorClass(id: string) {
    $('#' + id).parents('.form-control').removeClass('form-error');
    $('#' + id).parents('.form-control').children('.form-inp').children('.errorMessage').html('');
  }
}
export class GuardName {
  id: number; // 本条信息ID
  buildingId: string;
  buildingNum: string;
  buildingName: string;
  floorId: string; // 楼层
  roomId:string; // 房间号
  username:string; // 订单人
  userDept:string; // 订单部门
  userTel: string; // 电话
  porpertyId:number; // 服务类型
  porpertyContent:string; // 服务详情
  serverUserid:string;
  orderId:string;     // 订单号
  filePath: string[]; // 文件路径
  fileName:string[]; // 文件名
  orderStatus:string; // 订单状态
  startTime:string;        // 订单生成时间
  finshTime:string;        // 订单结束时间
}
export class Arch {
  buildingId: string; // 大楼Id
  buildingNum:string; // 大楼编号
  buildingName: string='';// 大楼名称
  orderId:string;     // 订单号
  orderStatus:string='';   // 订单状态
  startTime:string;        // 订单生成时间
  finshTime:string;        // 订单结束时间
  serverUserid:string;  // 订单人
  userDept:string;  // 订单部门
}
