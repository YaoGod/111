import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
const initValue = {
  buildingId : "0",
  classId    : "0",
  group      : ""
};
@Injectable()
export class GlobalOptionService {

  private option : any = initValue;
  valueUpdated:Subject<any> = new Subject<any>();
  constructor() { }

  setVal(val:any){
    console.log(val);
    this.option = val === "0"?initValue:val;
    this.valueUpdated.next(this.option);
  }

  getVal():Array<any>{
    return this.option;
  }
}
