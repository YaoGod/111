import { Injectable } from '@angular/core';

@Injectable()
export class Building{
  /* 大楼建筑 Building */
  id:            number; /* id */
  buildingId:    number; /* 大楼编号 */
  name:          string; /* 大楼名称 */
  address:       string; /* 地址 */
  type:          string; /* 大楼性质 */
  use:           string; /* 功能 */
  belongTo:      string; /*大楼所属*/
  area:          string; /*面积*/
  floorNum:      number; /*楼层数*/
  height:        string; /*高度*/
  lat:           string; /*经度*/
  lon:           string; /*纬度*/
  serviceUnit:   string; /*物业服务单位*/
  summary:       string; /*简介*/
  useDepartment: string; /* 使用部门 */
}
