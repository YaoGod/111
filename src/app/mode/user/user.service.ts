import { Injectable } from '@angular/core';

@Injectable()
export class User {
  /*登陆用户*/
  id       : number;
  userid     : string;
  username : string;
  password : string;
  teleNum: string;
  homeAddr: string;
  deptId  : string;
  deptName: string;
}
