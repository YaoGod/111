import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {Room} from "../../../mode/room/room.service";
import {sndCatalog} from "../../../mode/catalog/catalog.service";

declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-vehicle-info',
  templateUrl: './vehicle-info.component.html',
  styleUrls: ['./vehicle-info.component.css'],
  providers:[UtilBuildingService,Room]
})
export class VehicleInfoComponent implements OnInit {
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public rule : any;
  public jurisdiction:any;
  public newRoom     : Room = new Room();
  constructor(
    private http: Http,
    private errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
    private utilBuildingService:UtilBuildingService,
    public ipSetting  : IpSettingService
  ) {
    this.rule = this.globalCatalogService.getRole("security/daily");
  }

  ngOnInit() {
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("security/daily");
        this.getQuan();
      }
    );
    this.getQuan();
  }
  /*获取权限*/
  private getQuan(){
    if(this.rule!=null){
      let url = "/portal/user/getCata/"+this.rule.ID+"/repair?url=";
      this.ipSetting.sendGet(url).subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          for(let i = 0;i<data.data.length;i++){
            if(data.data[i].routeUrl === "repair"){
              this.jurisdiction = data.data[i];
            }
          }
        }
      });
    }
  }
  addVehicle(){
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('新增车辆信息');
    /*let url = "/building/repair/addRepairRecord";
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {

      }
    });*/
  }
  addCancel(){
    $('.mask').fadeOut();
    /*let url = "/building/repair/addRepairRecord";
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {

      }
    });*/
  }
  /*新建房间平面图上传*/
  presepic_upload(files){
    var xhr = this.utilBuildingService.uploadImg(files[0], 'room', -1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          this.newRoom.imgPath = data.msg;
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
    if (!this.isEmpty('Id', '不能为空')) {
      return false;
    }
    return true;
  }

  submit(){

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
  isPark: string; // 是否停车摇号
  carFare: string; // 交通费额度
  
}
