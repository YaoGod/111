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
  public pageSize = 6;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public buildings: any;
  public rule : any;
  public floorNames   : Array<any>; /*大楼楼层名称列表*/
  public deptMent:string;
  private editBool = true;
  public URL: string;

  constructor(private http: Http,
              private errorVoid:ErrorResponseService,
              private utilBuildingService:UtilBuildingService,
              private infoBuildingService:InfoBuildingService,
              private globalCatalogService:GlobalCatalogService,
              public ipSetting  : IpSettingService
  ) {
  }

  ngOnInit() {
    this.getRule();
    this.searchArch = new Arch();
    this.repairname = new GuardName();
    this.pages = [];
    this.repairname.fileName = [];
    this.repairname.filePath = [];
    this.searchArch.orderStatus = "";
    this.getBuildings();
    this.getRecord(this.searchArch, this.pageNo, this.pageSize);
    this.getDeptName();
    this.URL = this.ipSetting.ip;
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'logistics','employ/logistics/property')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.rule = data.data[1];
        }
      })
  }
  /*获取用户部门*/
  private getDeptName(){
      let url =  "/portal/user/getDeptName";
      this.ipSetting.sendGet(url).subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.repairname.userDept = data['data'];
          this.deptMent = data['data'];
        }
      });
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

    let url = "/employee/property/getOrder/list/" + pageNo + "/" + pageSize+"?buildingName="+search.buildingName+"&orderId="+
      search.orderId+"&orderStatus="+ search.orderStatus+"&startTime="+search.startTime+"&finshTime="+search.finshTime+
      "&serverUserid="+search.serverUserid+ "&userDept="+search.userDept;
    this.ipSetting.sendGet(url).subscribe(data => {
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
  delAttach(index){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除？',
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        let url = "/employee/property/deleteOrder/" +index;
        this.ipSetting.sendGet(url).subscribe(data => {
          if (this.errorVoid.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示',
              'mes': data['msg'],
              'popType': 0,
              'imgType': 1,
            });
            this.pages = [];
            this.pageNo = 1;
            this.getRecord(this.searchArch, this.pageNo, this.pageSize);
          }
        });
      }
    });
  }
  /*编辑信息*/
  editAttach(index){
    this.editBool = false;
    this.repairname = JSON.parse(JSON.stringify(this.record[index]));
    this.getFloorNameListInfo(this.repairname.buildingId);
    $('.mask').fadeIn();
    $('.mask-head p').html('编辑物业订单');
  }
  /*点击新增*/
  addOrder(){
    this.repairname = new GuardName();
    this.repairname.fileName = [];
    this.repairname.filePath = [];
    /*虚拟员工部门电话*/
    this.repairname.userTel = localStorage.getItem("teleNum");
    this.repairname.userDept = this.deptMent;
    this.editBool = true;
    $('.mask').fadeIn();
    $('.mask-head p').html('新增物业订单');
  }
  /*信息校验*/
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
    if (!this.verifybuildingId() || !this.verifyservername() || !this.verifydetail()) {
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
    this.repairname.orderStatus = '1';
    this.ipSetting.sendPost(url, this.repairname)
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
  userDept:string; // 员工部门
  userTel: string; // 电话
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
