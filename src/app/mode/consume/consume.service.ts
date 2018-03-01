import { Injectable } from '@angular/core';

@Injectable()
export class ConsumeService {
  id          : number;
  name        : string;
  DEPT_NAME   : string;
  orderNo     : string;
  userid      : string;
  createUserid: string;
  createTime  : string;
  consumeType : string;
  consumeTime : string;
  consumeNum  : string;
  detail      : any;
  AMOUNT      : number;
  OL_DATE     : string;
  note        : string;
  consumeContent: string;
}
