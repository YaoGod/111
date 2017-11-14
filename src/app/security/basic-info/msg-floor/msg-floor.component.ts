import { Component, OnInit } from '@angular/core';
import { InfoBuildingService } from '../../../service/info-building/info-building.service';
import { GlobalBuildingService } from '../../../service/global-building/global-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { Building } from '../../../mode/building/building.service';
import { Floor } from '../../../mode/floor/floor.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-msg-floor',
  templateUrl: './msg-floor.component.html',
  styleUrls: ['./msg-floor.component.css'],
  providers:[InfoBuildingService,Building,Floor]
})
export class MsgFloorComponent implements OnInit {

  public building:Building;    /*大楼信息*/
  public floors: Array<Floor>;        /*大楼楼层列表*/
  private pageNo: number = 1;
  private pageSize: number = 8;
  public pages: Array<number>;
  constructor(
    private globalBuilding:GlobalBuildingService,
    private infoBuildingService:InfoBuildingService,
    private router: Router,
    private errorVoid:ErrorResponseService
  ) {
    this.building = globalBuilding.getVal();
  }

  ngOnInit() {
    this.floors = new Array<Floor>();
    this.globalBuilding.valueUpdated.subscribe(
      (val) =>{
        this.building = this.globalBuilding.getVal();
      }
    );
    this.getFloorInfo(this.pageNo,this.pageSize);
  }
  /*获取楼层信息*/
  getFloorInfo(pageNo:number,pageSize:number){
    var id = this.router.url.split('/')[5];
    this.infoBuildingService.getFloorListMsg( Number(id), pageNo,pageSize)
      .subscribe(data =>{
        if(this.errorVoid.errorMsg(data.status)) {
          this.floors = data.data.infos;
          let total = Math.ceil(data.data.total / pageSize);
          this.initPage(total);
        }
      });
  }
  /*页码初始化*/
  initPage(total){
    this.pages = new Array(total);
    for(let i = 0;i< total;i++){
      this.pages[i] = i+1;
    }
  }
  /*页面显示区间5页*/
  pageLimit(page:number){
    if(this.pageNo<5){
      return true;
    }
    else if(page<=5 && this.pageNo <= 3){
      return false;
    }
    else if(page>=this.pages.length -4 && this.pageNo>=this.pages.length-2){
      return false;
    }
    else if (page<=this.pageNo+2 && page>=this.pageNo-2){
       return false;
    }
    return true;
  }
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    this.getFloorInfo(this.pageNo,this.pageSize);
  }
}
