import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  public voteWrap:any;
  constructor(
    private globalCatalogService:GlobalCatalogService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("工会管理");
    this.voteWrap = [{
      list: [
        {id:2,inner:'会员管理',imgPath:'assets/image/gg2.png'},
        {id:3,inner:'员工关爱',imgPath:'assets/image/gg3.png'},
        {id:4,inner:'职工小（小小）家',imgPath:'assets/image/gg4.png'},
        {id:5,inner:'班组管理',imgPath:'assets/image/gg5.png'},
        {id:6,inner:'俱乐部管理',imgPath:'assets/image/gg6.png'},
        {id:7,inner:'疗休养',imgPath:'assets/image/gg8.png'}
      ],
      name: '档案管理区'
    },{
      list: [
        {id:9,inner:'创先争优建功立业',imgPath:'assets/image/cc1.png'},
        {id:10,inner:'帮困暖心员工关爱',imgPath:'assets/image/cc2.png'},
        {id:11,inner:'班组建设',imgPath:'assets/image/cc3.png'},
        {id:12,inner:'民主管理和谐发展',imgPath:'assets/image/cc4.png'},
      ],
      name: '工作展示区'
    },{
      list: [
        {id:1,inner:'职代会',imgPath:'assets/image/gg1.png'},
        {id:8,inner:'工会活动报账',imgPath:'assets/image/gg7.png'},
      ],
      name: '流程操作区'
    }]
  }

}
