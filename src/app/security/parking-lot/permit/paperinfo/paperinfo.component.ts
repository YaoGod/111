import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {SaleProductEmployeeService} from "../../../../service/sale-product-employee/sale-product-employee.service";
import {UtilBuildingService} from "../../../../service/util-building/util-building.service";
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {ActivatedRoute} from "@angular/router";

declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-paperinfo',
  templateUrl: './paperinfo.component.html',
  styleUrls: ['./paperinfo.component.css'],
  providers:[UtilBuildingService,SaleProductEmployeeService,]
})
export class PaperinfoComponent implements OnInit {

  public newCard = new CardInfo();
  constructor(private http: Http,
              private errorVoid:ErrorResponseService,
              private globalCatalogService:GlobalCatalogService,
              private utilBuildingService:UtilBuildingService,
              private saleProductEmployeeService:SaleProductEmployeeService,
              private route:ActivatedRoute,
              public ipSetting  : IpSettingService) { }

  ngOnInit() {
    this.route.params.subscribe(data => {
       this.editCardInfo(data.id);
    });
    // this.editCardInfo();
  }
  editCardInfo(id){
    // this.getUserName(useId);
    // this.getUserCar(useId);
    let url = '/building/parking/getParkingPermitInfo/'+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        console.log(data.data);
        this.newCard = data.data;
      }
    });
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('编辑停车证');
  }
}
export class CardInfo {
  id: number; // 本条信息ID
  buildingName:string; // 大楼名称
  buildingId:string; // 大楼ID
  useUserId: string;// 员工编号
  useUserName:string; // 员工姓名
  useUserDept: string; // 员工部门
  useUserTel:string; // 员工电话
  eTime:string; // 有效期开始日期
  bTime: string; // 有效期截止日期
  modifyTime:string; // 发放日期
  useCarCode: string; // 车牌号
  status: string; // 状态
  name:string;// 停车证名称x
  code: string; // 停车证编码
  type: string; // 停车证类型
  note:string; // 备注

}
