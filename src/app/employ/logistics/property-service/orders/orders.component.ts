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
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  providers: [InfoBuildingService,ErrorResponseService,UtilBuildingService]
})
export class OrdersComponent implements OnInit {
  public searchArch : Arch;
  public record: Array<GuardName>;
  public repairname: GuardName;
  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public buildings: any;
  public rule : any;
  public jurisdiction:any;
  public serviceCom:any;
  private editBool = true;


  constructor(private http: Http,
              private errorVoid:ErrorResponseService,
              private utilBuildingService:UtilBuildingService,
              private globalCatalogService:GlobalCatalogService,
              private ipSetting  : IpSettingService
  ) {
    this.rule = this.globalCatalogService.getRole("property/orders");
    this.getQuan();
  }

  ngOnInit() {
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("property/orders");

        this.getQuan();
      }
    );
    this.searchArch = new Arch();
    this.repairname = new GuardName();
    this.pages = [];
    this.repairname.fileName = [];
    this.repairname.filePath = [];
    this.searchArch.orderStatus = "";
    this.getBuildings();
    this.getRecord(this.searchArch, this.pageNo, this.pageSize);

  }

  /*获取权限*/
  private getQuan(){
    if(this.rule!=null){
      let SOFTWARES_URL =  "/portal/user/getCata/"+this.rule.ID+"/repair";
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

    const SOFTWARES_URL =  this.ipSetting.ip + "/employee/property/getOrder/list/" + pageNo + "/" + pageSize+"?buildingNum="+
      search.buildingNum+"&buildingName="+search.buildingName+"&orderId="+search.orderId+"&orderStatus="+
      search.orderStatus+"&startTime="+search.startTime+"&finshTime="+search.finshTime+"&serverUserid="+search.serverUserid+
    "&userDept="+search.userDept;
    this.http.get(SOFTWARES_URL)
      .map(res => res.json())
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.record = data['data']['infos'];
          this.total = data.data.total;
        }
      });
  }
  /*点击查询*/
  private repairSearch(){
    this.getRecord(this.searchArch, this.pageNo, this.pageSize)
  }
  /*删除信息*/
  delAttach(index){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除？',
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        let url = "/employee/property/deleteOrder/" + index;
        this.ipSetting.sendGet(url).subscribe(data => {
          if (this.errorVoid.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示',
              'mes': data['msg'],
              'popType': 0,
              'imgType': 1,
            })
          }
        });
      }
    });
  }
  /*编辑信息*/
  editAttach(index){
    this.editBool = false;
    this.repairname = JSON.parse(JSON.stringify(this.record[index]));
    /*虚拟员工部门电话*/
    this.repairname.employeeDepart = localStorage.getItem("deptName");
    this.repairname.employeePhone = localStorage.getItem("teleNum");

    $('.mask').fadeIn();
    $('.mask-head p').html('编辑物业订单');
  }
  /*点击新增*/
  addOrder(){
    this.repairname = new GuardName();
    this.repairname.fileName = [];
    this.repairname.filePath = [];

    /*虚拟员工部门电话*/
    this.repairname.employeeDepart = localStorage.getItem("deptName");
    this.repairname.employeePhone = localStorage.getItem("teleNum");

    this.editBool = true;
    $('.mask').fadeIn();
    $('.mask-head p').html('新增物业订单');
  }
  /*合同信息校验*/
  private verifybuildingId() {
    if (!this.isEmpty('buildingId', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyservername() {
    if (!this.isEmpty('servername', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyemployeeDepart() {
    if (!this.isEmpty('employeeDepart', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyemployeePhone()  {
    if (!this.isEmpty('employeePhone', '不能为空')) {
      return false;
    }
    if (!this.verifyIsTel('employeePhone', '格式不对')) {
      return false;
    }
    return true;
  }
  private verifydetail() {
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
    let SOFTWARES_URL;
    if(this.editBool === false){
      SOFTWARES_URL = this.ipSetting.ip + "/employee/property/updateOrder";
    }else{
      SOFTWARES_URL = this.ipSetting.ip + "/employee/property/addOrder";
    }
    if (!this.verifybuildingId() || !this.verifyservername() || !this.verifyemployeePhone() ||
      !this.verifydetail()) {
      return false;
    }

    if( this.repairname.filePath.length<1 ) {
      confirmFunc.init({
        'title': '提示' ,
        'mes': '请上传文件信息',
        'popType': 0 ,
        'imgType': 2 ,
      });
      return false;
    }
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    this.http.post(SOFTWARES_URL, this.repairname, options)
      .map(res => res.json())
      .subscribe(data => {
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
  private closeDeriving() {
    $('#deriving').hide();
  }
  /*导出数据下载*/
  private downDeriving(){
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
        window.location.href = this.ipSetting.ip + "/employee/property/getOrder/list/"+ this.pageNo +"/"+ this.pageSize +"?buildingNum="+
          this.searchArch.buildingNum+"&buildingName="+this.searchArch.buildingName+"&orderId="+this.searchArch.orderId+
          "&orderStatus="+ this.searchArch.orderStatus+"&startTime="+this.searchArch.startTime+"&finshTime="+
          this.searchArch.finshTime+"&serverUserid="+this.searchArch.serverUserid+ "&userDept="+this.searchArch.userDept;
        this.searchArch = new Arch();
        $('#deriving').fadeOut();
      });
  }
  /*页码初始化*/
  initPage(total) {
    this.pages = new Array(total);
    for(let i = 0;i< total ;i++) {
      this.pages[i] = i+1;
    }
  }
  /*页面显示区间5页*/
  pageLimit(page:number) {
    if(this.pages.length < 5){
      return false;
    } else if(page<=5 && this.pageNo <= 3){
      return false;
    } else if(page>=this.pages.length -4 && this.pageNo>=this.pages.length-2){
      return false;
    } else if (page<=this.pageNo+2 && page>=this.pageNo-2){
      return false;
    }
    return true;
  }
  /*跳页加载数据*/
  goPage(page:number) {
    this.pageNo = page;
    this.getRecord(this.searchArch, this.pageNo, this.pageSize);
  }
  /**非空校验*/
  private isEmpty(id: string, error: string): boolean  {
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
  private verifyIsNumber(id: string, error: string): boolean  {
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
  private verifyIsTel(id: string, error?: string): boolean {
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
  private verifyLength8(id: string, error: string): boolean  {
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
  private  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-control').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('span').html('输入错误');
    }else {
      $('#' + id).next('span').html(error);
    }
  }
  /** 去除错误信息class */
  private  removeErrorClass(id: string) {
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
  employeeDepart:string; // 员工部门
  employeePhone: string; // 电话
  porpertyId:number; // 服务类型
  porpertyContent:string; // 服务详情
  orderId:string;     // 订单号
  filePath: string[]; // 文件路径
  fileName:string[]; // 文件名
  orderStatus:string; // 订单状态
}
export class Arch {
  buildingId: string; // 大楼Id
  buildingNum:string; // 大楼编号
  buildingName: string;// 大楼名称
  orderId:string;     // 订单号
  orderStatus:string;   // 订单状态
  startTime:string;        // 订单生成时间
  finshTime:string;        // 订单结束时间
  serverUserid:string;  // 订单人
  userDept:string;  // 订单部门
}
