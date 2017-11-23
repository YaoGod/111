import { Component, OnInit } from '@angular/core';
import { GlobalBuildingService } from '../../../service/global-building/global-building.service';
import { Router,ActivatedRoute } from '@angular/router';
import { InfoBuildingService } from '../../../service/info-building/info-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { Building } from '../../../mode/building/building.service';
import { Floor } from '../../../mode/floor/floor.service';
import { Room } from '../../../mode/room/room.service';
import { UtilBuildingService } from '../../../service/util-building/util-building.service';
import * as $ from 'jquery';
declare var confirmFunc: any;
declare var $:any;
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
  providers:[InfoBuildingService,UtilBuildingService,Building,Floor,Room]
})
export class RoomComponent implements OnInit {

  public building     : Building;       /*大楼信息*/
  public floor        : Floor =  new Floor();
  public rooms        : Array<Room>;
  private pageNo      : number = 1;
  private pageSize    : number = 5;
  public pages        : Array<number>;
  public isViewImg    : boolean = true;
  public imgWidth     : number = 500;
  public copyRooms   : any;
  public imgSrcView   : string;
  public newRoom     : Room = new Room();
  public isOpenNewView: boolean =false;
  constructor(
    private globalBuilding:GlobalBuildingService,
    private router: Router,
    private route:ActivatedRoute,
    private infoBuildingService:InfoBuildingService,
    private utilBuildingService:UtilBuildingService,
    private errorVoid:ErrorResponseService

  ) {
    this.building = globalBuilding.getVal();
  }
  ngOnInit() {
    this.route.params.subscribe(data => {
      this.floor.id = data.id;
      this.initRoom();
    });

  }
  initRoom(){
    this.pageNo = 1;
    this.rooms = new Array<Room>();
    this.copyRooms =[];
    this.pages = [];
    this.getFloorInfo(this.pageNo,this.pageSize);
  }
  /*获取楼层信息*/
  getFloorInfo(pageNo:number,pageSize:number){
    this.infoBuildingService.getRoomListMsg( this.floor.id, pageNo,pageSize)
      .subscribe(data =>{
        if(this.errorVoid.errorMsg(data.status)) {
          this.rooms = data.data.infos;
          this.copyRooms = JSON.parse(JSON.stringify(this.rooms));
          for( var i = 0;i<this.copyRooms.length;i++){
            this.copyRooms[i].editStatus = false;
          }
          console.log(this.copyRooms);
          let total = Math.ceil(data.data.total / pageSize);
          this.initPage(total);
        }
      });
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
    if(!this.copyRooms[index].editStatus){
      /*进入编辑*/
      this.copyRooms[index].editStatus = true;
      console.log( this.copyRooms[index]);
    }else{
      /*取消编辑*/
      this.copyRooms[index] = JSON.parse(JSON.stringify(this.rooms[index]));
      this.copyRooms[index].editStatus = false;
    }
  }
  /*保存*/
  save(index:number){
    if(this.copyRooms[index].editStatus){
      this.infoBuildingService.updateRoom(this.copyRooms[index])
        .subscribe(data => {
          if(this.errorVoid.errorMsg(data.status)){
            if(data.msg = '更新成功'){
              this.copyRooms[index] = this.copyRooms[index];
              this.copyRooms[index].editStatus = false;
              this.rooms[index] =JSON.parse(JSON.stringify(this.copyRooms[index]));
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
          this.copyRooms[index].imgPath = data.msg;
        }
      }
    };
  }
  /*新建房间平面图上传*/
  presepic_upload(files){
    var xhr = this.utilBuildingService.uploadImg(files[0],'floor',-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data.status)){
          this.newRoom.imgPath = data.msg;
        }
      }
    };
  }
  /*添加新房间窗口弹出*/
  addNewRoom(){
    this.newRoom = new Room();
/*    this.newRoom.buildingName = this.building.name;
    this.newRoom.buildingId = this.building.id;
    this.newRoom.floorUse = '';*/
    this.isOpenNewView = true;
    $('.mask').css('display','block');
  }
  /*添加楼层窗口关闭*/
  closeNewView(){
    this.isOpenNewView = false;
    $('.mask').css('display','none');
    this.newRoom = new Room();
  }
  /*提交新楼层信息*/
  submit(){
    console.log(this.newRoom);
    if(this.newRoom.roomNum!= ''){
      this.infoBuildingService.updateRoom(this.newRoom)
        .subscribe(data => {
          if(this.errorVoid.errorMsg(data.status)){
            confirmFunc.init({
              'title': '提示' ,
              'mes': data.msg,
              'popType': 0 ,
              'imgType': 1 ,
            });
            this.closeNewView();
            this.initRoom();
          }
        })
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
