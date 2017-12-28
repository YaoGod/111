import { Injectable } from '@angular/core';

@Injectable()
export class SupermarketApplier {

  applyId:          string;/*经销商id*/
  applyName:        string;/*经销商名称*/
  copStarttime:     string;/*合作开始时间*/
  copEndtime:       string;/*合作结束时间*/
  applyDesc:        string;/*描述*/

  constructor() { }

}
