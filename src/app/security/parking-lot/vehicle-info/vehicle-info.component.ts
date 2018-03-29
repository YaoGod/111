import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {Room} from "../../../mode/room/room.service";
import {SaleProductEmployeeService} from "../../../service/sale-product-employee/sale-product-employee.service";

declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-vehicle-info',
  templateUrl: './vehicle-info.component.html',
  styleUrls: ['./vehicle-info.component.css'],
  providers:[UtilBuildingService,SaleProductEmployeeService,]
})
export class VehicleInfoComponent implements OnInit {
  public pageSize = 6;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages= [];
  public rule : any;
  public deptList: any;
  public jurisdiction:any;
  private contractBool = true;
  public searchInfo : CardInfo = new CardInfo();
  public newCard = new CardInfo();
  public record : Array<CardInfo> = new Array<CardInfo>();
  constructor(
    private http: Http,
    private errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
    private utilBuildingService:UtilBuildingService,
    private saleProductEmployeeService:SaleProductEmployeeService,
    public ipSetting  : IpSettingService
  ) {
    this.rule = this.globalCatalogService.getRole("security/parking");
  }

  ngOnInit() {
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("security/parking");
        this.getQuan();
      }
    );
    this.getQuan();
    this.getCardInfo(this.searchInfo);
    this.getDeptList();
    this.searchInfo.userDept= '';
  }
  /*获取权限*/
  private getQuan(){
    if(this.rule!=null){
      let url = "/portal/user/getCata/"+this.rule.ID+"/parking?url=";
      this.ipSetting.sendGet(url).subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          for(let i = 0;i<data.data.length;i++){
            if(data.data[i].routeUrl === "parking"){
              this.jurisdiction = data.data[i];
            }
          }
        }
      });
    }
  }
  /*根据员工号获取人员和姓名*/
  getUserName(value){
    if(value&&value.length>7){
      let url = "/portal/user/getUserInfo/"+value;
      this.ipSetting.sendGet(url).subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.newCard.userDept = data.data.deptId;
          this.newCard.userName = data.data.username;
        }
        if (data.status === 1) {
          this.newCard.userDept = '';
          this.newCard.userName = '';
        }
      });
    }
  }
  /*获取车辆信息*/
  getCardInfo(postData){
    let url = "/building/carInfo/getCarInfoList/"+this.pageNo+"/"+this.pageSize;
     this.ipSetting.sendPost(url,postData).subscribe(data => {
       if(this.errorVoid.errorMsg(data)) {
          // console.log(data.data.infos);
          this.record = data.data.infos;
          this.total = data.data.total;
       }
     });
  }
  /*获取所有部门列表*/
  getDeptList(){
    this.saleProductEmployeeService.getDeptList()
      .subscribe(data =>{
        if(this.errorVoid.errorMsg(data)){
          this.deptList = data.data;
        }
      });
  }
  repairSearch(num){
    this.pageNo = num;
    this.getCardInfo(this.searchInfo);
  }
  /*点击新增*/
  addVehicle(){
    this.contractBool = true;
    this.newCard = new CardInfo();
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('新增车辆信息');
  }
  /*取消*/
  addCancel(){
    $('.mask').fadeOut();
    $('.errorMessage').html('');
  }
  /*点击编辑*/
  editCardInfo(id){
    this.contractBool = false;
    let url = '/building/carInfo/getCarInfo/'+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        // console.log(data.data);
        this.newCard = data.data
      }
    });
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('编辑车辆信息');
  }
  /*点击删除*/
  delCardInfo(id){
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let url = '/building/carInfo/deleteCarInfo/'+id;
        this.ipSetting.sendGet(url).subscribe(data => {
          if(this.errorVoid.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示' ,
              'mes': data['msg'],
              'popType': 0 ,
              'imgType': 1 ,
            });
            this.pageNo = 1;
            this.getCardInfo(this.searchInfo);
          }
        });
      }
    });

  }
  /*驾驶证上传*/
  prese_upload1(files){
    let inner = '';
    var xhr = this.utilBuildingService.uploadImg(files[0], 'driverA', -1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          inner = data.msg;
          this.newCard.imgPathList.driverA.push(inner);
          // console.log(this.newCard.imgPathList.driverA);
        }
      }else if(xhr.readyState === 4 && xhr.status === 413 ){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '图片大小超出限制',
          'popType': 1 ,
          'imgType': 2 ,
        });
      }
    };
  }
  /*行驶证上传*/
  prese_upload2(files){
    let inner = '';
    var xhr = this.utilBuildingService.uploadImg(files[0], 'driverB', -1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          inner = data.msg;
          this.newCard.imgPathList.driverB.push(inner);
          // console.log(this.newCard.imgPathList.driverB);
        }
      }else if(xhr.readyState === 4 && xhr.status === 413 ){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '图片大小超出限制',
          'popType': 1 ,
          'imgType': 2 ,
        });
      }
    };
  }
  public verifyId() {
    if (!this.isEmpty('userId', '不能为空')) {
      return false;
    }
    /*if (!this.isEmpty('userName', '编号有误')) {
      return false;
    }*/
    return true;
  }
  public verifydriverName() {
    if (!this.isEmpty('driverName', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifydriverNum() {
    if (!this.isEmpty('driverNum', '不能为空')) {
      return false;
    }
    if(!this.verifyIsCard('driverNum','号码有误')){
      return false;
    }
    return true;
  }
  public verifydriverCode() {
    if (!this.isEmpty('driverCode', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifycarOwner() {
    if (!this.isEmpty('carOwner', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifycarNumber() {
    if (!this.isEmpty('carNumber', '不能为空')) {
      return false;
    }
    if(!this.verifyIsCardNum('carNumber','车牌有误')){
      return false;
    }
    return true;
  }

  public verifycarCode() {
    if (!this.isEmpty('carCode', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifymotorNum() {
    if (!this.isEmpty('motorNum', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifycarBrand() {
    if (!this.isEmpty('carBrand', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyisPark() {
    if (!this.isEmpty('isPark', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifycarFare() {
    if (!this.isEmpty('carFare', '不能为空')) {
      return false;
    }
    return true;
  }
  submit(){
    var url;
    if(this.contractBool === false){
      url = "/building/carInfo/updateCarInfo";
    }else{
      url = "/building/carInfo/addCarInfo";
    }
    if (!this.verifyId() ||!this.verifydriverName() || !this.verifydriverNum() || !this.verifydriverCode() ||
      !this.verifycarOwner() || !this.verifycarNumber() || !this.verifycarCode() || !this.verifymotorNum() ||
      !this.verifycarBrand() || !this.verifyisPark() || !this.verifycarFare()) {
      return false;
    }
    this.ipSetting.sendPost(url, this.newCard).subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        confirmFunc.init({
          'title': '提示' ,
          'mes': this.contractBool === false?'更改成功':'新增成功',
          'popType': 0 ,
          'imgType': 1 ,
        });
        this.repairSearch(1);
        this.addCancel();
      }
    });

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
  /** 验证身份证号码  */
  public verifyIsCard(id: string, error?: string): boolean {
    const data =  $('#' + id).val();
    if (!String(data).match( /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/ )){
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /** 验证车牌号  */
  public verifyIsCardNum(id: string, error?: string): boolean {
    const data =  $('#' + id).val();
    if (!String(data).match(/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/)){
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
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
  userId: string;// 员工编号
  userName:string; // 员工姓名
  userDept: string; // 员工部门
  driverName: string; // 驾驶员姓名
  driverNum: string; // 驾驶证号
  driverCode: string; // 驾驶证档案编号
  carOwner: string; // 车辆所有人姓名
  carNumber: string; // 车牌号码
  carCode: string; // 车辆识别代码
  motorNum: string; // 发动机号
  carBrand:string; // 车辆品牌型号
  isPark: string = ''; // 是否停车摇号
  carFare: string; // 交通费额度
  imgPath:string;
  imgContentList={
    driverA: [], // 驾驶证
    driverB: []  // 行驶证
  };
  imgPathList={
    driverA: [],
    driverB: []
  }
}
