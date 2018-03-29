import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {SaleProductEmployeeService} from "../../../service/sale-product-employee/sale-product-employee.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";

declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-permit',
  templateUrl: './permit.component.html',
  styleUrls: ['./permit.component.css'],
  providers:[UtilBuildingService,SaleProductEmployeeService,]
})
export class PermitComponent implements OnInit {
  public pageSize = 6;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  private contractBool = true;
  public buildings: any;
  public deptList: any;
  public searchInfo = new CardInfo();
  public newCard = new CardInfo();
  public record : Array<CardInfo> = new Array<CardInfo>();
  constructor( private http: Http,
               private errorVoid:ErrorResponseService,
               private globalCatalogService:GlobalCatalogService,
               private utilBuildingService:UtilBuildingService,
               private saleProductEmployeeService:SaleProductEmployeeService,
               public ipSetting  : IpSettingService) { }

  ngOnInit() {
    /*this.repairSearch(1);
    this.getBuildings();
    this.getDeptList();
    this.searchInfo.useUserDept = '';*/
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
  /*获取所有部门列表*/
  getDeptList(){
    this.saleProductEmployeeService.getDeptList()
      .subscribe(data =>{
        if(this.errorVoid.errorMsg(data)){
          this.deptList = data.data;
        }
      });
  }
  /*获取停车证信息*/
  getPermitInfo(postData){
    let url = "/building/parking/getParkingPermitList/"+this.pageNo+"/"+this.pageSize;
    this.ipSetting.sendPost(url,postData).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        // console.log(data.data.infos);
        this.record = data.data.infos;
        this.total = data.data.total;
      }
    });
  }
  repairSearch(num){
    this.pageNo = num;
    this.getPermitInfo(this.searchInfo);
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
            this.getPermitInfo(this.searchInfo);
          }
        });
      }
    });

  }
}
export class CardInfo {
  id: number; // 本条信息ID
  buildingName:string; // 大楼名称
  buildingId:string; // 大楼ID
  useUserId: string;// 员工编号
  useUserName:string; // 员工姓名
  useUserDept: string; // 员工部门
  useUserTel:string; // 电话
  eTime:string; // 有效期
  bTime: string; // 发放日期
  useCarCode: string; // 车牌号
  status: string; // 状态
  name:string;// 停车证名称
  code: string; // 停车证编码
  type: string; // 停车证类型
  note:string; // 备注

}
