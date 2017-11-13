import { Injectable } from '@angular/core';

@Injectable()
export class Floor {

  /*楼层实体类*/
  id: number;           /*大楼ID*/
  buildingId: number;   /*大楼编号*/
  buildingName: string; /*大楼名称*/
  floorNum: string;     /*楼层号*/
  floorUse: string;     /*楼层功能*/
}
