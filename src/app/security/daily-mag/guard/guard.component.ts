import { Component, OnInit } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {InfoBuildingService} from "../../../service/info-building/info-building.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";

declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-guard',
  templateUrl: './guard.component.html',
  styleUrls: ['./guard.component.css'],
  providers: [InfoBuildingService,ErrorResponseService,UtilBuildingService]
})
export class GuardComponent implements OnInit {
  public searchRepair:SearchRecord;
  public repairname: RepairName;
  public record: Array<RepairName>;
  constructor() { }

  ngOnInit() {
    this.searchRepair =  new SearchRecord();
    this.repairname = new RepairName();

  }

}
export class RepairName {
  id: number; // 本条信息ID
  buildingId: string;
  buildingName: string;
  recordId: string; // 维修单编号
  repairType: string; // 维修类别
  cmccDepartment: string; // 需要维修部门
  cmccContacts: string; // 需要维修单位联系人
  cmccPhone: string; // 需要维修单位联系人电话
  repairCost: string; // 维修费用
  repairDepartment: string; // 维修商
  repairContacts: string; // 维修商联系人
  repairPhone: string; // 维修商联电话
  repairBtime: string; // 开始时间
  repairEtime: string; // 结束时间
  repairNote: string; // 详细内容
}
export class SearchRecord {
  buildingId: string; // 大楼编号
  buildingName: string;  // 大楼名称
  fitmentNum: string; // 装修单编号
  contractType: string; // 'decorate'
  decorateBtime: string; // 合同开始时间
  decorateEtime: string; // 合同结束时间
}
