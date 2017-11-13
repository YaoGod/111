import { Component, OnInit } from '@angular/core';
import { InfoBuildingService } from '../../../service/info-building/info-building.service';
import { GlobalBuildingService } from '../../../service/global-building/global-building.service';
import { Building } from '../../../mode/building/building.service';
import { Floor } from '../../../mode/floor/floor.service';
@Component({
  selector: 'app-msg-floor',
  templateUrl: './msg-floor.component.html',
  styleUrls: ['./msg-floor.component.css'],
  providers:[InfoBuildingService,Building,Floor]
})
export class MsgFloorComponent implements OnInit {

  public building:Building;    /*大楼信息*/
  public floors: Array<Floor>;        /*大楼楼层列表*/
  private level: string = '1'; /*初始显示楼层*/
  private pageNo: number = 1;
  private pageSize:number = 8;
  constructor(
    private globalBuilding:GlobalBuildingService,
    private infoBuildingService:InfoBuildingService
  ) {
    this.building = globalBuilding.getVal();
  }

  ngOnInit() {
    console.log(111);
    this.floors = new Array<Floor>();
    this.globalBuilding.valueUpdated.subscribe(
      (val) =>{
        this.building = this.globalBuilding.getVal();
      }
    );
    this.getFloorInfo(this.pageNo,this.pageSize);
  }
  getFloorInfo(pageNo:number,pageSize:number){
    this.infoBuildingService.getFloorListMsg(this.building.id,pageNo,pageSize)
      .subscribe(data =>{
        this.floors = data.data.infos;
        console.log(this.floors);
      });
  }

}
