import { Component, OnInit } from '@angular/core';
import {Building} from '../../../mode/building/building.service';
import { GlobalBuildingService } from '../../../service/global-building/global-building.service';

@Component({
  selector: 'app-msg-basic',
  templateUrl: './msg-basic.component.html',
  styleUrls: ['./msg-basic.component.css'],
  providers: [Building]
})
export class MsgBasicComponent implements OnInit {
  public building:Building = new Building;  /*大楼信息*/
  constructor(
    private globalBuilding:GlobalBuildingService
  ) {
    this.building = globalBuilding.getVal();
  }

  ngOnInit() {
    /*大楼信息更新订阅*/
    this.globalBuilding.valueUpdated.subscribe(
      (val) =>{
        this.building = this.globalBuilding.getVal();
        console.log(this.building);
      }
    );
  }

}
