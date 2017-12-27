import { Component, OnInit } from '@angular/core';
import {WorkspaceMydeskService} from "../../../service/workspace-mydesk/workspace-mydesk.service";

@Component({
  selector: 'app-orderhand',
  templateUrl: './orderhand.component.html',
  styleUrls: ['./orderhand.component.css'],
  providers: [WorkspaceMydeskService]
})
export class OrderhandComponent implements OnInit {

  // public rooms: Array<Room>;
  public rooms = new Array<number>();
  public pageNo      : number = 1;
  public pageSize    : number = 10;
  public total       : number = 0;
  constructor(
    private workspaceMydeskService:WorkspaceMydeskService
  ) {

  }

  ngOnInit() {
    this.initConsume();
  }

  initConsume() {
    this.rooms = new Array<number>();
    this.pageNo = 1;
    this.getRoomInfo(1);
  }
  /*获取消费记录信息*/
  getRoomInfo(pageNo: number) {
    this.pageNo = pageNo;
    this.workspaceMydeskService.getHandlingOrder()
      .subscribe(data => {
        /*this.rooms = data.data.infos;
        this.total = data.data.total;*/
      });
  }
  back(){
    history.go(-1);
  }
}
