import { Injectable } from '@angular/core';

@Injectable()
export class Contract {
  id           : number;  /*id*/
  buildingId   : number;  /*所属大楼id*/
  buildingName : string;  /*大楼名称*/
  fileName     : Array<string>;  /*附件名称*/
  filePath     : Array<string>;  /*附件地址*/

  contractStatus: string;   /*合同状态*/ /*多个合同公用*/
  /*自购*/
  buyName      : string;  /*购买方*/
  buyContacts  : string;  /*购买方联系人*/
  buyPhone     : string;  /*购买方联系人电话*/
  buyCost      : string;  /*购买价格*/
  buyDate      : string;  /*购买日期*/
  salesName    : string;  /*卖方*/
  unitPrice    : string;  /*单价*/
  area         : string;   /*建筑面积*/

  /*自建合同*/
  build        : string;  /*施工单位*/
  buildCost    : string;  /*建造费用*/
  buildDate    : string;  /*建造日期*/
  design       : string;  /*设计单位*/
  payDate      : string;  /*交付日期*/
  supervise    : string;  /*监理单位*/

  /*租赁合同*/
  landlord     : string;   /*甲方*/
  lContacts    : string;
  lPhone       : string;
  lMail        : string;    /*甲方邮箱（该类型必填）*/
  /*cmccName     : string;    /!*乙方*!/
   cmccContacts : string;
   cmccPhone    : number;
   contractBtime: string;   /!*开始时间*!/
   contractEtime: string;   /!*结束时间*!/
   contractStatus: string;   /!*合同状态*!/*/

  /*物业合同*/
  cmccName     : string;   /*甲方*/
  cmccContacts : string;
  cmccPhone    : number;
  name         : string;   /*乙方*/
  contacts     : string;
  phone        : number;
  mail         : string;    /*乙方邮箱（该类型必填）*/
  contractBtime: string;   /*开始时间*/
  contractEtime: string;   /*结束时间*/
/* contractStatus: string;  /!*合同状态*!/  */
}
