import { Component, OnInit } from '@angular/core';
import { InfoBuildingService } from '../../../service/info-building/info-building.service';
import { GlobalBuildingService } from '../../../service/global-building/global-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { Building } from '../../../mode/building/building.service';
import { Floor } from '../../../mode/floor/floor.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { UtilBuildingService } from '../../../service/util-building/util-building.service';
declare var $:any;
@Component({
  selector: 'app-msg-floor',
  templateUrl: './msg-floor.component.html',
  styleUrls: ['./msg-floor.component.css'],
  providers:[InfoBuildingService,UtilBuildingService,Building,Floor]
})
export class MsgFloorComponent implements OnInit {

  public building   : Building;       /*大楼信息*/
  public floors     : Array<Floor>;   /*大楼楼层列表*/
  public floorNames : Array<any>;  /*大楼楼层名称列表*/
  public searchFloor: Floor;
  private pageNo    : number = 1;
  private pageSize  : number = 8;
  public pages      : Array<number>;
  public isViewImg  : boolean = true;
  public imgWidth   : number = 500;
  public copyFloors : any;
  constructor(
    private globalBuilding:GlobalBuildingService,
    private infoBuildingService:InfoBuildingService,
    private utilBuildingService:UtilBuildingService,
    private router: Router,
    private errorVoid:ErrorResponseService
  ) {
    this.building = globalBuilding.getVal();
  }

  ngOnInit() {
    this.floors = new Array<Floor>();
    this.copyFloors =[];
    this.pages = [];
    let id =Number( this.router.url.split('/')[5]);
    this.searchFloor = new Floor();
    this.searchFloor.buildingId = id;
    this.searchFloor.floorNum = '';
    this.globalBuilding.valueUpdated.subscribe(
      (val) =>{
        this.building = this.globalBuilding.getVal();
      }
    );
    this.getFloorNameListInfo(id);
    this.getFloorInfo(this.pageNo,this.pageSize);
  }
  /*获取楼层信息*/
  getFloorInfo(pageNo:number,pageSize:number){
    var copySearch = JSON.parse(JSON.stringify(this.searchFloor));
    if(this.searchFloor.floorNum === '') {
      copySearch.floorNum = undefined;
    }
    this.infoBuildingService.getFloorListMsg( copySearch, pageNo,pageSize)
      .subscribe(data =>{
        if(this.errorVoid.errorMsg(data.status)) {
          this.floors = data.data.infos;
          this.copyFloors = JSON.parse(JSON.stringify(this.floors));
          let total = Math.ceil(data.data.total / pageSize);
          this.initPage(total);
        }
      });
  }
  /*获取楼层名称*/
  getFloorNameListInfo(id:number){
    this.infoBuildingService.getFloorNameListMsg(id)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data.status)) {
          this.floorNames = data.data;
        }
      });
  }
  search(){
    this.pageNo = 1;
    this.pageSize = 8;
    this.getFloorInfo(this.pageNo,this.pageSize);
  }
  /*页码初始化*/
  initPage(total){
    this.pages = new Array(total);
    for(let i = 0;i< total;i++){
      this.pages[i] = i+1;
    }
  }
  /*页面显示区间5页*/
  pageLimit(page:number){
    if(this.pageNo<5){
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
    this.getFloorInfo(this.pageNo,this.pageSize);
  }
  /*查看图片*/
  viewImg(){
    this.isViewImg = false;
  }
  closeViewImg(){
    this.isViewImg = true;
  }
  /*放大图片*/
  addImg(){
    if(this.imgWidth<1000){
      this.imgWidth += 50;
    }
  }
  /*缩小图片*/
  decsImg(){
    if(this.imgWidth>500){
      this.imgWidth -= 50;
    }
  }
  /*初始化编辑*/
  initEdit(index: number){
    if(!this.copyFloors[index].editStatus){
      /*进入编辑*/
      this.copyFloors[index].editStatus = true;
    }else{
      /*取消编辑*/
      this.copyFloors[index] = JSON.parse(JSON.stringify(this.floors[index]));
      this.copyFloors[index].editStatus = false;
    }
  }
  /*保存*/
  save(index:number){
    this.copyFloors[index].editStatus = false;
    console.log(this.copyFloors[index]);
    this.infoBuildingService.updateFloor(this.copyFloors[index])
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data.status)){
          console.log(data);
        }
      })
  }
  /*文件图片上传*/
  prese_upload(files,index){
    var xhr = this.utilBuildingService.uploadImg(files[0],'floor',-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        console.log(data);
        if(this.errorVoid.errorMsg(data.status)){
          this.copyFloors[index].imgPath = data.msg;
        }
      }
    };
  }
}
