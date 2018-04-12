import { Injectable } from '@angular/core';

@Injectable()
export class Vote {

  id         : number;
  title      : string;
  content    : string;
  bTime      : string;
  eTime      : string;
  targetId   : Array<string>;
  targetName : Array<string>;
  type       : string;
  status     : string;
  resultType : string;
  maxResult  : number;
  minResult  : number;
  options     : Array<Option>;
}

export class Option{
  title      : string;
  content    : string;
  imgPath    : string;
  imgContent : string;
  choose     : boolean;
}
