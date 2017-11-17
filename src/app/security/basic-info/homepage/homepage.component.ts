import { Component, OnInit } from '@angular/core';
import { Building } from '../../../mode/building/building.service';
import { InfoBuildingService } from '../../../service/info-building/info-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import {split} from "ts-node/dist";
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  providers: [InfoBuildingService,ErrorResponseService]
})
export class HomepageComponent implements OnInit {
  public buildings :Array<Building>;
  public imgPaths : any;
  private pageNo    :number = 1; /*当前页码*/
  private pageSize  :number = 3; /*显示页数*/
  private search    :string = ''; /*搜索字段*/
  public pages: Array<number>;
  constructor(
    private infoBuildingService:InfoBuildingService,
    private errorVoid:ErrorResponseService
  ) { }

  ngOnInit() {
    this.getBuildingMsg(this.pageNo,this.pageSize);
  }
  /*获取大楼列表*/
  getBuildingMsg(pageNo,pageSize){
    this.infoBuildingService.getBuildingList(pageNo,pageSize,this.search)
      .subscribe(data =>{
        if(this.errorVoid.errorMsg(data.data.errorVoid)){
          this.buildings = data.data.infos;
          let total = Math.ceil(data.data.total / pageSize);
          this.initPage(total);
          this.splitImgPaths(this.buildings);
        }
      });
  }
  splitImgPaths(subject: any){
    var list = [];
    for (var i = 0; i < subject.length; i++) {
      if(subject[i].imgPath !== null) {
        list[i] = subject[i].imgPath.split(',');
      }else{
        list[i] = new Array(0);
      }
    }
    this.imgPaths = list;
  }
  /*页码初始化*/
  initPage(total){
    this.pages = new Array(total);
    for(let i = 0;i< total ;i++){
      this.pages[i] = i+1;
    }
  }
  /*页面显示区间5页*/
  pageLimit(page:number){
    if(this.pages.length < 5){
      return false;
    }
    else if(this.pageNo < 5){
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
    this.getBuildingMsg(this.pageNo,this.pageSize);
  }

}
