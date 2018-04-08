import { Injectable } from '@angular/core';

@Injectable()
export class Vote {

  bTime      : string;
  eTime      : string;
  targetId   : string;
  targetName : string;
  type       : string;
  status     : string;
  maxResult  : number;
  minResult  : number;
}
