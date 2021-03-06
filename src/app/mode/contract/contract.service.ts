import { Injectable } from '@angular/core';

@Injectable()
export class Contract {
  id           : number;  /*id*/
  buildingId   : number;  /*所属大楼id*/
  buildingName : string;  /*大楼名称*/
  fileName     : string;  /*附件名称*/
  filePath     : string;  /*附件地址*/

  /*自购*/
  buyName      : string;  /*购买方*/
  buyContacts  : string;  /*购买方联系人*/
  buyPhone     : string;  /*购买方联系人电话*/
  buyCost      : string;  /*购买价格*/
  buyDate      : string;  /*购买日期*/
  salesName    : string;  /*卖方*/
  unitPrice    : string;  /*单价*/

  /*自建合同*/
  build        : string;  /*施工单位*/
  buildCost    : string;  /*建造费用*/
  buildDate    : string;  /*建造日期*/
  design       : string;  /*设计单位*/
  payDate      : string;  /*交付日期*/
  supervise    : string;  /*监理单位*/

  /*租赁合同*/
/*cmccName     : string;    /!*甲方*!/
  cmccContacts : string;
  cmccPhone    : number;
  contractBtime: string;   /!*开始时间*!/
  contractEtime: string;   /!*结束时间*!/*/
  landLord     : string;   /*乙方*/
  lContacts    : string;   /*乙方联系人*/
  lPhone       : string;   /*乙方联系电话*/


  /*物业合同*/
  cmccName     : string;   /*甲方*/
  cmccContacts : string;
  cmccPhone    : number;
  name         : string;   /*乙方*/
  contacts     : string;
  phone        : number;
  contractBtime: string;   /*开始时间*/
  contractEtime: string;   /*结束时间*/
  contactStatus: string;   /*合同状态*/

}
