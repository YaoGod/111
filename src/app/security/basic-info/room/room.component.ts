import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { InfoBuildingService } from '../../../service/info-building/info-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { Building } from '../../../mode/building/building.service';
import { Floor } from '../../../mode/floor/floor.service';
import { Room } from '../../../mode/room/room.service';
import { UtilBuildingService } from '../../../service/util-building/util-building.service';
import { GlobalCatalogService } from '../../../service/global-catalog/global-catalog.service';
import { sndCatalog } from '../../../mode/catalog/catalog.service';
import * as $ from 'jquery';
declare var confirmFunc: any;
declare var $:any;
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
  providers:[InfoBuildingService,UtilBuildingService,Building,Floor,Room,sndCatalog]
})
export class RoomComponent implements OnInit {
  public floor        : Floor =  new Floor();
  public rooms        : Array<Room>;
  private pageNo      : number = 1;
  private pageSize    : number = 6;
  public pages        : Array<number>;
  public isViewImg    : boolean = true;
  public imgWidth     : number = 500;
  public copyRooms   : any;
  public imgSrcView   : string;
  public newRoom     : Room = new Room();
  public isOpenNewView: boolean =false;
  public title        : string = "新增";
  public rule         : sndCatalog = new sndCatalog();
  constructor(
    private globalCatalogService:GlobalCatalogService,
    private router: Router,
    private route:ActivatedRoute,
    private infoBuildingService:InfoBuildingService,
    private utilBuildingService:UtilBuildingService,
    private errorVoid:ErrorResponseService
  ) {
    this.rule = this.globalCatalogService.getRole("security/basic");
  }
  ngOnInit() {
    this.route.params.subscribe(data => {
      this.floor.id = data.id;
      this.getFloor(this.floor.id);
      this.initRoom();
    });
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("security/basic");
      }
    );
  }
  /*获取指定大楼信息*/
  getFloor(id) {
    this.infoBuildingService.getFloorMsg(id)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.floor = data.data;
        }
      })
  }
  initRoom() {
    this.pageNo = 1;
    this.rooms = new Array<Room>();
    this.copyRooms =[];
    this.pages = [];
    this.getRoomInfo(this.pageNo,this.pageSize);
  }
  /*获取楼层信息*/
  getRoomInfo(pageNo:number,pageSize:number){
    this.infoBuildingService.getRoomListMsg( this.floor.id, pageNo,pageSize)
      .subscribe(data =>{
        if(this.errorVoid.errorMsg(data)) {
          this.rooms = data.data.infos;
          this.copyRooms = JSON.parse(JSON.stringify(this.rooms));
          for( var i = 0;i<this.copyRooms.length;i++){
            this.copyRooms[i].editStatus = false;
          }
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
    if(this.pages.length < 5){
      return false;
    } else if(page<=5 && this.pageNo <= 3){
      return false;
    } else if(page>=this.pages.length -4 && this.pageNo>=this.pages.length-2){
      return false;
    } else if (page<=this.pageNo+2 && page>=this.pageNo-2){
      return false;
    }
    return true;
  }
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    this.getRoomInfo(this.pageNo,this.pageSize);
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
    this.addNewRoom();
    this.title = "编辑";
    this.newRoom = this.copyRooms[index];
    /*if(!this.copyRooms[index].editStatus){
      /!*进入编辑*!/
      this.copyRooms[index].editStatus = true;
    }else{
      /!*取消编辑*!/
      this.copyRooms[index] = JSON.parse(JSON.stringify(this.rooms[index]));
      this.copyRooms[index].editStatus = false;
    }*/

  }
  /*保存*/
  /*save(){
        this.infoBuildingService.updateRoom(this.copyRooms[index])
          .subscribe(data => {
            if(this.errorVoid.errorMsg(data)){
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
                "callback": () => {
                  if(data.msg = '更新成功'){
                    this.copyRooms[index] = this.copyRooms[index];
                    this.copyRooms[index].editStatus = false;
                    this.rooms[index] =JSON.parse(JSON.stringify(this.copyRooms[index]));
                  }
                  $("#prese"+index).val('');
                }
              });
            }
          })
  }*/
  /*删除信息*/
  delRoom(id) {
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1,
      'imgType': 3,
      "callback": () => {
        this.infoBuildingService.deleteRoom(id)
          .subscribe( data => {
            if(this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
                "callback": () => {
                  this.initRoom();
                }
              });

            }
          });
      }
    });
  }

  /*文件图片上传*/
  prese_upload(files, index) {
    var xhr = this.utilBuildingService.uploadImg(files[0], 'floor', -1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          this.copyRooms[index].imgPath = data.msg;
        }
      }else if(xhr.readyState === 4 && xhr.status === 413 ){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '图片大小超出限制',
          'popType': 1 ,
          'imgType': 2 ,
        });
      }
    };
  }
  /*新建房间平面图上传*/
  presepic_upload(files){
    var xhr = this.utilBuildingService.uploadImg(files[0], 'room', -1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          this.newRoom.imgPath = data.msg;
        }
      }
    };
  }
  /*添加新房间窗口弹出*/
  addNewRoom(){
    this.title = "新建";
    this.newRoom = new Room();
    this.newRoom.floorId = this.floor.id;
    this.isOpenNewView = true;
    $('.mask').css('display','block');
  }
  /*添加楼层窗口关闭*/
  closeNewView(){
    this.isOpenNewView = false;
    $('.form-control').removeClass('red');
    $('#newImgPath').removeClass('red');
    $('.error').fadeOut();
    $('.mask').css('display', 'none');
    this.newRoom = new Room();
    this.copyRooms = JSON.parse(JSON.stringify(this.rooms));
  }
  /*提交新楼层信息*/
  submit() {
    this.verifyImgPath(this.newRoom.imgPath, 'newImgPath');
    this.verifyEmpty(this.newRoom.roomNum, 'newRoomNum');
    this.verifyEmpty(this.newRoom.roomUse, 'newRoomUse') ;
    this.verifyEmpty(this.newRoom.roomArea, 'newRoomArea') ;
    this.verifySeatNumber(this.newRoom.seatingNum, 'newSeatingNum') ;
    this.verifyEmpty(this.newRoom.roomUseReal, 'newRoomUserReal');
    this.verifyMaxLength(this.newRoom.roomUseReal, 'newRoomUserReal', 50);

    if($('.red').length === 0) {
      if(typeof(this.newRoom.id) === "undefined" || this.newRoom.id === null){
        this.infoBuildingService.addRoom(this.newRoom)
          .subscribe(data => {
            if (this.errorVoid.errorMsg(data)){
              confirmFunc.init({
                'title': '提示' ,
                'mes': data.msg,
                'popType': 2 ,
                'imgType': 1 ,
                "callback": () => {
                  $('#pres').val('');
                  this.closeNewView();
                  this.initRoom();
                }
              });
            }
          })
      }else{
        this.infoBuildingService.updateRoom(this.newRoom)
          .subscribe(data => {
            if(this.errorVoid.errorMsg(data)){
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
                "callback": () => {
                  if(data.msg = '更新成功'){
                    $('#pres').val('');
                    this.closeNewView();
                    this.initRoom();
                  }
                }
              });
            }
          })
      }
    }else{
      confirmFunc.init({
        'title': '提示' ,
        'mes': '表单数据填写不完全哦',
        'popType': 0 ,
        'imgType': 2 ,
      });
    }
  }
  verifySeatNumber(value, id) {
    if(this.newRoom.roomUse == '员工办公室' && !this.verifyEmpty( value, id)){
      return false;
    }else{
      return true;
    }
  }
  verifyImgPath(value,id){
    if(typeof (value) === "undefined" ||
      value === null ||
      value === ''){
      this.addErrorClass(id,'请上传图片');
      return false;
    }else{
      this.removeErrorClass(id);
      return true;
    }
  }
  verifyEmpty( value, id){
    if(typeof (value) === "undefined" ||
      value === null ||
      value === ''){
      this.addErrorClass(id,'该值不能为空');
      return false;
    }else{
      this.removeErrorClass(id);
      return true;
    }
  }
  verifyMaxLength( value, id, len){
    if(typeof (value) === "undefined" ||
      value === null ||
      value === ''){
      this.addErrorClass(id, '该值不能为空');
      return false;
    }else if ( value.length > len) {
      this.addErrorClass(id, '不能超过' + len + '个字');
      return false;
    }
    else {
      this.removeErrorClass(id);
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
  /*字数限制*/
  limitText(value,limit) {
    if(value.length > limit) {
      return value.substr(0,limit);
    }
    return value;
  }

}
