import { Injectable } from '@angular/core';

@Injectable()
export class Room {

  id: number;
  roomNum: string;      /*房间号*/
  floorId: string;     /*楼层编号*/
  imgPath: string;      /*房间平面图*/
  roomUse: string;       /*房间用途*/
  roomArea: string;      /*房间用途*/
  seatingNum: string;    /*设计作为数*/
  roomUseReal: string;  /*房间实际用途*/
}
