import { Component, OnInit } from '@angular/core';
import {InfoBuildingService} from "../../../service/info-building/info-building.service";
import {Room} from "../../../mode/room/room.service";

@Component({
  selector: 'app-orderhand',
  templateUrl: './orderhand.component.html',
  styleUrls: ['./orderhand.component.css'],
  providers: [InfoBuildingService]
})
export class OrderhandComponent implements OnInit {

  // public rooms: Array<Room>;
  public rooms = new Array<number>();
  public pages: Array<number>;
  private pageNo      : number = 1;
  private pageSize    : number = 10;

  constructor(
    private infoBuildingService:InfoBuildingService
  ) {

  }

  ngOnInit() {
    this.initConsume();
  }

  initConsume() {
    // this.rooms = new Array<Room>();
    this.rooms = new Array<number>();
    this.pageNo = 1;
    this.pages = [];

    // this.rooms = [1,2,3,4,5,6];
    this.getRoomInfo(this.pageNo,this.pageSize);
  }

  /*页码初始化*/
  initPage(total) {
    this.pages = new Array(total);
    for (let i = 0; i < total; i++) {
      this.pages[i] = i + 1;
    }
  }

  /*获取消费记录信息*/
  getRoomInfo(pageNo: number, pageSize: number) {
    this.infoBuildingService.getRoomListMsg(44, pageNo, pageSize)
      .subscribe(data => {
        console.log(data);
        this.rooms = data.data.infos;

        // for (var i = 0; i < data.data.infos.length; i++) {
        //   this.rooms.push(data.data.infos[i]);
        // }
        console.log(this.rooms);
        let total = Math.ceil(80 / pageSize);
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
    this.getRoomInfo(this.pageNo,this.pageSize);
  }

}
