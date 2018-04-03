import { Component, OnInit } from '@angular/core';
import {InfoBuildingService} from "../../../../service/info-building/info-building.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {UtilBuildingService} from "../../../../service/util-building/util-building.service";
import {Http, RequestOptions, Headers} from "@angular/http";
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {Room} from "../../../../mode/room/room.service";

declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  providers: [InfoBuildingService,ErrorResponseService,UtilBuildingService,Room]
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
  public repairDept :any;
  public rooms  : Array<Room>;
  public useful = [];
  public usefulSecond = [];
  public onNum:string;
  public plateNum=[];
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
    this.getTypeSelect();
    this.getRepairDept();

    this.URL = this.ipSetting.ip;
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'logistics','employ/logistics/property')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.rule = data.data[1];
          console.log(this.rule);
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
  /*获取维修部门列表*/
  getRepairDept(){
    let url = '/building/repair/getRepairDept';
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.repairDept = data.data;
      }
    });
  };
  /*获取一级服务内容*/
  getTypeSelect(){
    let url = "/employee/property/getTypeSelect";
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        let res = [];
        for(let i=0;i<data['data'].length;i++){
          res.push(data['data'][i].type);
        }
        this.useful = this.unique(res);
      }
    });
  }
  getServerSelect(id,type){
    let url = "/employee/property/getServerSelect?buildingID="+id+'&type='+type;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.usefulSecond = data.data;
        for(let i=0;i<this.usefulSecond.length;i++){
          // console.log(this.usefulSecond.length);
          if(this.usefulSecond.length===1 && (!this.usefulSecond[0].porpertyId||this.usefulSecond[0].porpertyId==='')){
            this.repairname.amount = this.usefulSecond[0].realAmount;
            this.repairname.serverPersonName = this.usefulSecond[0].serverPersonName;
            this.repairname.serverPersonTel = this.usefulSecond[0].serverPersonTel;
          }
        }
      }
    });
  }
  queryName(porpertyId){
    // console.log(this.usefulSecond);
    if(!porpertyId||porpertyId===''){
      this.repairname.amount = this.usefulSecond[0].realAmount;
      this.repairname.serverPersonName = this.usefulSecond[0].serverPersonName;
      this.repairname.serverPersonTel = this.usefulSecond[0].serverPersonTel;
    }else{
      for(let i=0;i<this.usefulSecond.length;i++){
        if(this.usefulSecond[i].id == porpertyId){
          this.repairname.amount = this.usefulSecond[i].realAmount;
          this.repairname.serverPersonName = this.usefulSecond[i].serverPersonName;
          this.repairname.serverPersonTel = this.usefulSecond[i].serverPersonTel;
          if(this.repairname.amount === null){
            $('#stock').html('');
          }else if(this.repairname.amount<1){
            $('#stock').html('库存不足');
          }
        }
      }
    }

  }
  /*获取二级服务内容*/
  getNameSelect(name,current){
    let url = "/employee/property/getNameSelect?type="+name;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.usefulSecond = data.data;
        // console.log(data.data);
        if(data.data.length===1 && data.data[0].isDetails==='2' ){
          this.onNum = data.data[0].isAmount;
        }else{
          for(let i=0;i<data.data.length;i++){
            if(data.data[i].name === current){
              this.onNum = data.data[i].isAmount;
            }
          }
        }
      }
    });
  }
  /*获取自己拥有车辆*/
  getUserCar(){
    let inner = [];
    let url = "/building/carInfo/getUserCar/"+localStorage.getItem("username");
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        for(let i =0;i<data.data.length;i++){
          inner.push(data.data[i].carNumber);
        }
        this.plateNum = inner;
        // console.log(inner);
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
          // console.log(data.data);
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
  repairSearch(num){
    this.pageNo = num;
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
  editAttach(index,status,prompt){
    /*this.editBool = false;
    this.repairname = JSON.parse(JSON.stringify(this.record[index]));
    this.getFloorNameListInfo(this.repairname.buildingId);
    $('.mask').fadeIn();
    $('.mask-head p').html('编辑物业订单');*/

    confirmFunc.init({
      'title': '提示',
      'mes': prompt,
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        let url = "/employee/property/updateOrder";
        let post = {
          id:index,
          orderStatus:status
        };
        this.ipSetting.sendPost(url, post).subscribe(data => {
          if (this.errorVoid.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示',
              'mes': data['msg'],
              'popType': 0,
              'imgType': 1,
            });
            this.getRecord(this.searchArch, this.pageNo, this.pageSize);
          }
        });
      }
    });
  }
  /*获取楼层房间信息*/
  changeSel(id){
    for (let i=0;i<this.floorNames.length;i++) {
      if (this.floorNames[i].FLOOR_NUM == id) {
        this.infoBuildingService.getRoomListMsg( this.floorNames[i].ID, 1,99)
          .subscribe(data =>{
            if(this.errorVoid.errorMsg(data)) {
              this.rooms = data.data.infos;
            }
          });
      }
    }

  }
  /*点击新增*/
  addOrder(){
    this.getUserCar();
    this.repairname = new GuardName();
    this.repairname.fileName = [];
    this.repairname.filePath = [];
    /*虚拟员工部门电话*/
    this.onNum = '2';
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
    if (!this.isEmpty('type', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyserverPersonName() {
    if (!this.isEmpty('serverPersonName', '未发现人员')) {
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
        if(this.errorVoid.errorMsg(data)){
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
  /*删除文件*/
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
    if (!this.verifybuildingId() || !this.verifyservername() || !this.verifydetail() || !this.verifyserverPersonName()) {
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
  public unique(arr){
    var res =[];
    var json = {};
    for(let i=0;i<arr.length;i++){
      if(!json[arr[i]]){
        res.push(arr[i]);
        json[arr[i]] = 1;
      }
    }
    return res;
  }
}
export class GuardName {
  id: number; // 本条信息ID
  amount:number; // 库存
  realAmount:number; // 实时库存
  buildingId: string;
  buildingNum: string;
  buildingName: string;
  floorId: string; // 楼层
  roomId:string; // 房间号
  userDept:string; // 员工部门
  userTel: string; // 电话
  // type:string; // 服务项目
  propertyType:string; // 服务项目
  propertyName:string; // 服务内容
  porpertyId:string; // 服务内容id
  servername:string; // 具体服务内容
  porpertyContent:string; // 服务详情
  orderId:string;     // 订单号
  plateNum: string; // 车牌信息
  filePath: string[]; // 文件路径
  fileName:string[]; // 文件名
  orderStatus:string; // 订单状态
  username:string; // 订单人
  serverPersonName:string; // 服务人员姓名
  serverPersonTel:string; // 服务人员电话
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
