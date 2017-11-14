import { Component, OnInit } from '@angular/core';
import { Building } from '../../../mode/building/building.service';
import { GlobalBuildingService } from '../../../service/global-building/global-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
declare var AMap:any;
@Component({
  selector: 'app-msg-belong',
  templateUrl: './msg-belong.component.html',
  styleUrls: ['./msg-belong.component.css'],
  providers: [Building]
})
export class MsgBelongComponent implements OnInit {

  public building:Building;  /*大楼信息*/
  constructor(
    private globalBuilding:GlobalBuildingService,
    private errorVoid:ErrorResponseService
  ) {
    this.building = globalBuilding.getVal();
  }

  ngOnInit() {
    /*大楼信息更新订阅*/
    this.globalBuilding.valueUpdated.subscribe(
      (val) =>{
        this.building = this.globalBuilding.getVal();
      }
    );
    this.showMap();
  }
  showMap(){
    let map = new AMap.Map('map');
    map.plugin('AMap.Geolocation',() =>{
      let geolocation = new AMap.Geolocation({

      });
      map.addControl(geolocation);
    })
  }
}
