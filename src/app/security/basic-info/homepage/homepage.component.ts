import { Component, OnInit } from '@angular/core';
import { Building } from '../../../mode/building/building.service';
import { InfoBuildingService } from '../../../service/info-building/info-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import * as $ from 'jquery';
declare var $:any;
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
  private pageSize  :number = 6; /*显示页数*/
  public search    :Building ; /*搜索字段*/
  public pages: Array<number>;
  constructor(
    private infoBuildingService:InfoBuildingService,
    private errorVoid:ErrorResponseService
  ) { }

  ngOnInit() {
    this.search = new Building();
    this.search.type = '';
    this.getBuildingMsg();
  }
  /*获取大楼列表*/
  getBuildingMsg(){
    this.infoBuildingService.getBuildingList(this.pageNo,this.pageSize,this.search)
      .subscribe(data =>{
        if(this.errorVoid.errorMsg(data.status)){
          this.buildings = data.data.infos;
          let total = Math.ceil(data.data.total / this.pageSize);
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
    this.getBuildingMsg();
  }
  /*折叠动画*/
  slideToggle(){
    $('.panel').slideToggle();
  }
  /*删除*/
  delete(id:number){
    let d = confirm("是否删除该大楼");
    if(d){
      this.infoBuildingService.deleteBuilding(id)
        .subscribe(data => {
          if(this.errorVoid.errorMsg(data.status)) {
            alert(data.msg);
          }
        });
    }
  }
}
