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
  public pages: Array<number>;
  private pageNo      : number = 1;
  private pageSize    : number = 10;
  private queryType    : number;

  constructor(
    private infoBuildingService:InfoBuildingService
  ) {

  }

  ngOnInit() {
    this.initConsume();
  }

  initConsume() {
    this.rooms = new Array<Room>();
    this.pageNo = 1;
    this.pages = [];

    /*查询类型*/
    this.queryType = 1;

    this.getConsumeInfo(this.pageNo,this.pageSize);
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
    this.getConsumeInfo(this.pageNo,this.pageSize);
  }

  /*页码初始化*/
  initPage(total) {
    this.pages = new Array(total);
    for (let i = 0; i < total; i++) {
      this.pages[i] = i + 1;
    }
  }

  /*获取消费记录信息*/
  getConsumeInfo(pageNo: number, pageSize: number) {
    this.infoBuildingService.getRoomListMsg(44, pageNo, pageSize)
      .subscribe(data => {
        this.rooms = data.data.infos;
        // for (var i = 0; i < data.data.infos.length; i++) {
        //   this.rooms.push(data.data.infos[i]);
        // }
        console.log(this.rooms);
        let total = Math.ceil(data.data.total / pageSize);
        this.initPage(total);
      });
  }

  /*页面显示区间5页*/
  pageLimit(page:number){
    if(this.pages.length < 5){
      return false;
    } else if(page<=5 && this.pageNo <= 3){
      return false;
    } else if(page>=this.pages.length -4 && this.pageNo>=this.pages.length-2){
      return false;
    } else if (page<=this.pageNo+2 && page>=this.pageNo-2){
      return false;
    }
    return true;
  }
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    this.getConsumeInfo(this.pageNo,this.pageSize);
  }
}
