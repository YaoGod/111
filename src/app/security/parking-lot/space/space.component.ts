import { Component, OnInit } from '@angular/core';
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {Http} from "@angular/http";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";

declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.css'],
  providers:[UtilBuildingService,]
})
export class SpaceComponent implements OnInit {
  public pageSize = 12;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public newCard = new CardInfo();
  public record:any;
  public rule : any;
  public deptList: any;
  public jurisdiction:any;
  public buildings: any;
  public searchInfo : CardInfo = new CardInfo();
  private contractBool = true;
  constructor(private http: Http,
              private errorVoid:ErrorResponseService,
              public ipSetting  : IpSettingService,
              private utilBuildingService:UtilBuildingService,
              private globalCatalogService:GlobalCatalogService,
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
    this.getBuildings();
    this.repairSearch(1);
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
  /*获取大楼列表*/
  private getBuildings() {
    this.utilBuildingService.getBuildingList('')
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.buildings = data['data'];
          // console.log(this.buildings);
        }
      })
  }
  /*取消*/
  addCancel(){
    $('.mask,.mask1,.mask2').fadeOut();
    $('.errorMessage').html('');
  }
  /*点击编辑*/
  editCardInfo(id){
    this.contractBool = false;
    $('.disable').attr('disabled',true);
    let url = '/building/parkingSpace/getParkingSpaceInfo/'+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        // console.log(data.data);
        this.newCard = data.data;
      }
    });
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('编辑车位数量');
  }
  /*点击删除*/
  delCardInfo(id){
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let url = '/building/parkingSpace/deleteParkingSpaceInfo/'+id;
        this.ipSetting.sendGet(url).subscribe(data => {
          if(this.errorVoid.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示' ,
              'mes': data['msg'],
              'popType': 0 ,
              'imgType': 1 ,
            });
            this.repairSearch(this.pageNo);
          }
        });
      }
    });

  }
  repairSearch(num){
    this.pageNo = num;
    this.getCardInfo();
  }
  /*获取停车位信息*/
  getCardInfo(){
    let url = "/building/parkingSpace/getParkingSpaceList/"+this.pageNo+"/"+this.pageSize;
    let postData = JSON.parse(JSON.stringify(this.searchInfo));
    this.ipSetting.sendPost(url,postData).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        // console.log(data.data.infos);
        this.record = data.data.infos;
        this.total = data.data.total;
      }
    });
  }
  /*点击新增*/
  addVehicle(){
    this.contractBool = true;
    $('.disable').attr('disabled',false);
    this.newCard = new CardInfo();
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('新增停车位');
  }
  queryBuilding(name){
    for(let i=0;i<this.buildings.length;i++){
      if(this.buildings[i].NAME===name){
        this.newCard.buildingId = this.buildings[i].ID;
        this.newCard.buildingNum = this.buildings[i].BUILDING_ID;
      }
    }
  }
  public verifybuildingName() {
    if (!this.isEmpty('buildingName', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyparkingType() {
    if (!this.isEmpty('parkingType', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifymaxNum() {
    if (!this.isEmpty('maxNum', '不能为空')) {
      return false;
    }
    return true;
  }
  /*提交*/
  submit(){
    var url;
    if(this.contractBool === false){
      url = "/building/parkingSpace/updateParkingSpaceInfo";
    }else{
      url = "/building/parkingSpace/addParkingSpaceInfo";
    }
    if (!this.verifybuildingName() ||!this.verifyparkingType() ||!this.verifymaxNum() ) {
      return false;
    }
    this.ipSetting.sendPost(url,this.newCard).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示' ,
          'mes': data['msg'],
          'popType': 0 ,
          'imgType': 1 ,
        });
        this.addCancel();
        this.repairSearch(this.pageNo);
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
  buildingId: string; // 大楼ID
  buildingName = ''; // 大楼名称
  buildingNum; // 大楼名称
  maxNum: string; // 车位数
  parkingType = ''; // 停车位类型
  realNum: string; // 已使用
  status: string; // 状态


}
