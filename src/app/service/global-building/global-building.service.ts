import { Injectable } from '@angular/core';
import {Building} from "../../mode/building/building.service";
import { Subject } from 'rxjs';
@Injectable()
export class GlobalBuildingService {
  private building:Building = new Building;
  valueUpdated:Subject<Building> = new Subject<Building>();
  constructor() { }

  setVal(val:Building){
    this.building = val;
    this.valueUpdated.next(this.building);
  }

  getVal():Building{
    return this.building;
  }
}
