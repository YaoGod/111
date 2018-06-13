import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {IpSettingService} from "../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {UtilBuildingService} from "../../service/util-building/util-building.service";
import {SaleProductEmployeeService} from "../../service/sale-product-employee/sale-product-employee.service";

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css'],
  providers:[UtilBuildingService,SaleProductEmployeeService],
})
export class FeatureComponent implements OnInit {

  constructor(
    public http:Http,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
    private utilBuildingService:UtilBuildingService,
    private saleProductEmployeeService:SaleProductEmployeeService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("党建管理/工作台账上传");
  }

}
