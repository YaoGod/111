import { Component, OnInit } from '@angular/core';
import {Room} from "../../../../mode/room/room.service";
import {InfoBuildingService} from "../../../../service/info-building/info-building.service";

@Component({
  selector: 'app-wash-account',
  templateUrl: './wash-account.component.html',
  styleUrls: ['./wash-account.component.css'],
  providers: [InfoBuildingService]
})
export class WashAccountComponent implements OnInit {

  public rooms: Array<Room>;
  public pageNo       : number = 1;
  public pageSize     : number = 10;
  public queryType    : number;
  public total        : number = 0;
  constructor(
    private infoBuildingService:InfoBuildingService
  ) {

  }

  ngOnInit() {
    this.initConsume();
  }

  initConsume() {
    this.rooms = new Array<Room>();
    /*查询类型*/
    this.queryType = 1;
    this.getConsumeInfo(1);
  }

  /*选择查询类型*/
  queryTypeClick(queryType) {
    if (queryType === 0) {
      console.log('消费记录==='+queryType);
      this.queryType = 1;
    }else {
      console.log('充值记录==='+queryType);
      this.queryType = 0;
    }
    this.getConsumeInfo(1);
  }


  /*获取消费记录信息*/
  getConsumeInfo(pageNo: number) {
    this.pageNo = pageNo
    this.infoBuildingService.getRoomListMsg(44, this.pageNo, this.pageSize)
      .subscribe(data => {
        this.rooms = data.data.infos;
        this.total = data.data.total;
      });
  }
  back(){
    history.go(-1);
  }
}
