import { Injectable } from '@angular/core';

@Injectable()
export class Logger {

  id     : number;
  userId : number;
  userName:string;
  userDept: string;
  operationModule:string;
  operationContent: string;
  operationTime : string;
  clientIp: string;
  module : string;
  bTime  : string;
  eTime  : string;
}
