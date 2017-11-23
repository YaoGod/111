import { Component, OnInit } from '@angular/core';
import { InfoBuildingService } from '../../../service/info-building/info-building.service';
import { GlobalBuildingService } from '../../../service/global-building/global-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { Building } from '../../../mode/building/building.service';
import { Floor } from '../../../mode/floor/floor.service';
import { Router } from '@angular/router';
import { UtilBuildingService } from '../../../service/util-building/util-building.service';
import * as $ from 'jquery';
declare var confirmFunc: any;
declare var $:any;
@Component({
  selector: 'app-msg-floor',
  templateUrl: './msg-floor.component.html',
  styleUrls: ['./msg-floor.component.css'],
  providers:[InfoBuildingService,UtilBuildingService,Building,Floor]
})
export class MsgFloorComponent implements OnInit {

  public building     : Building;       /*大楼信息*/
  public floors       : Array<Floor>;   /*大楼楼层列表*/
  public floorNames   : Array<any>;  /*大楼楼层名称列表*/
  public searchFloor  : Floor;
  private pageNo      : number = 1;
  private pageSize    : number = 5;
  public pages        : Array<number>;
  public isViewImg    : boolean = true;
  public imgWidth     : number = 500;
  public copyFloors   : any;
  public imgSrcView   : string;
  public newFloor     : Floor = new Floor();
  public isOpenNewView: boolean =false;
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
    this.globalBuilding.valueUpdated.subscribe(
      (val) =>{
        this.building = this.globalBuilding.getVal();
      }
    );
    this.initFloor();
  }
  initFloor(){
    this.pageNo = 1;
    this.floors = new Array<Floor>();
    this.copyFloors =[];
    this.pages = [];
    let id =Number( this.router.url.split('/')[5]);
    this.searchFloor = new Floor();
    this.searchFloor.buildingId = id;
    this.searchFloor.floorNum = '';
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
          for( var i = 0;i<this.copyFloors.length;i++){
            this.copyFloors[i].editStatus = false;
          }
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
    this.pages = [];
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
  /*查看大楼房间信息*/
  goToRoom(id){
    var url = this.router.url.replace('floor','room');
    this.router.navigate([url,id]);
  }
  /*查看图片*/
  viewImg(url:string){
    this.isViewImg = false;
    this.imgSrcView = '/proxy' + url;
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
      console.log( this.copyFloors[index]);
    }else{
      /*取消编辑*/
      this.copyFloors[index] = JSON.parse(JSON.stringify(this.floors[index]));
      this.copyFloors[index].editStatus = false;
    }
  }
  /*保存*/
  save(index:number){
    if(this.copyFloors[index].editStatus){
      this.infoBuildingService.updateFloor(this.copyFloors[index])
        .subscribe(data => {
          if(this.errorVoid.errorMsg(data.status)){
            if(data.msg = '更新成功'){
              this.floors[index] = this.copyFloors[index];
              this.copyFloors[index].editStatus = false;
            }
          }
        })
    }
  }
  /*文件图片上传*/
  prese_upload(files,index){
    var xhr = this.utilBuildingService.uploadImg(files[0],'floor',-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data.status)){
          this.copyFloors[index].imgPath = data.msg;
        }
      }
    };
  }
  /*新建楼层的楼层平面图上传*/
  presepic_upload(files){
    var xhr = this.utilBuildingService.uploadImg(files[0],'floor',-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data.status)){
         this.newFloor.imgPath = data.msg;
        }
      }
    };
  }
  /*添加新楼层窗口弹出*/
  addNewFloor(){
    this.newFloor = new Floor();
    this.newFloor.buildingName = this.building.name;
    this.newFloor.buildingId = this.building.id;
    this.newFloor.floorUse = '';
    this.isOpenNewView = true;
    $('.mask').css('display','block');
  }
  /*添加楼层窗口关闭*/
  closeNewView(){
    this.isOpenNewView = false;
    $('.mask').css('display','none');
    this.newFloor = new Floor();
  }
  /*提交新楼层信息*/
  submit(){
    if(this.verifyImgPath()
      &&this.verifyFloorNum()
      &&this.verifyFloorUse()
    ){
      this.infoBuildingService.addFloor(this.newFloor)
        .subscribe(data => {
          if(this.errorVoid.errorMsg(data.status)){
            confirmFunc.init({
              'title': '提示' ,
              'mes': data.msg,
              'popType': 0 ,
              'imgType': 1 ,
            });
            this.closeNewView();
            this.initFloor();
          }
        })
    }
  }
  verifyImgPath(){
    if(typeof (this.newFloor.imgPath) === "undefined" ||
        this.newFloor.imgPath === null ||
        this.newFloor.imgPath === ''){
      this.addErrorClass('newImgPath','请上传图片');
      return false;
    }else{
      this.removeErrorClass('newImgPath');
      return true;
    }
  }
  verifyFloorNum(){
    if(typeof (this.newFloor.floorNum) === "undefined" ||
        this.newFloor.floorNum === null ||
        this.newFloor.floorNum === ''){
        this.addErrorClass('newFloorNum','请填写楼层');
      return false;
    }else{
      this.removeErrorClass('newFloorNum');
      return true;
    }
  }
  verifyFloorUse(){
    if(typeof (this.newFloor.floorUse) === "undefined" ||
      this.newFloor.floorUse === null ||
      this.newFloor.floorUse === ''){
      this.addErrorClass('newFloorUse','请选择楼层功能');
      return false;
    }else{
      this.removeErrorClass('newFloorUse');
      return true;
    }
  }
  /* 添加错误信息*/
  private addErrorClass(id: string, error: string)  {
    $('#' + id).addClass('red');
    $('#' + id).parent().next('.error').fadeIn().html(error);
  }
  /*去除错误信息*/
  private  removeErrorClass(id: string) {
    $('#' + id).removeClass('red');
    $('#' + id).parent().next('.error').fadeOut();
  }
}
