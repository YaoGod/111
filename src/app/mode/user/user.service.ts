import { Injectable } from '@angular/core';

@Injectable()
export class User {
  /*登陆用户*/
  id       : number;
  userid   : string;
  username : string;
  password : string;
  teleNum  : string;
  homeAddr : string;
  deptId   : string;
  deptName : string;
  sex      : string;
  oaEmail  : string;
  status   : string;
  flag     : string; /*标志位无意义*/
  isDelete : string;
  serviceCenter: string;
  createTime: string;
  modifyTime: string;
  isBoolean: boolean;
}

export class Role{
  roleId: number;
  roleName: string;
  note: string;
  flag: string;
  choose: boolean;
  createTime: string;
  modifyUserId:string;
}

export class Ability{
  id: number;
  cataName: string;
  icon: string;
  cataUrl: string;
  fatherId: number;
  choose: boolean;
  createTime: string;
}
