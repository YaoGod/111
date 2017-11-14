import { Injectable } from '@angular/core';

@Injectable()
export class Contract {
  id           : number;  /*id*/
  buildingId   : number;  /*所属大楼id*/
  buildingName : string;  /*大楼名称*/

  build        : string;  /*施工单位*/
  buildCost    : string;  /*建造费用*/
  buildDate    : string;     /*建造日期*/
  design       : string;  /*设计单位*/
  fileName     : string;  /*附件名称*/
  filePath     : string;  /*附件地址*/
  payDate      : string;  /*交付日期*/
  supervise    : string;  /*监理单位*/


}
