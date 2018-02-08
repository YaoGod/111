import { Component, OnInit } from '@angular/core';
import { InfoBuildingService } from '../../../service/info-building/info-building.service';
import { GlobalBuildingService } from '../../../service/global-building/global-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { Building } from '../../../mode/building/building.service';
import { Floor } from '../../../mode/floor/floor.service';
import { Router } from '@angular/router';
import { UtilBuildingService } from '../../../service/util-building/util-building.service';
import { GlobalCatalogService } from '../../../service/global-catalog/global-catalog.service';
import { sndCatalog } from '../../../mode/catalog/catalog.service';
import * as $ from 'jquery';
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
declare var confirmFunc: any;
declare var $:any;
@Component({
  selector: 'app-msg-floor',
  templateUrl: './msg-floor.component.html',
  styleUrls: ['./msg-floor.component.css'],
  providers:[InfoBuildingService,UtilBuildingService,Building,Floor,sndCatalog]
})
export class MsgFloorComponent implements OnInit {

  public building     : Building;       /*大楼信息*/
  public floors       : Array<Floor>;   /*大楼楼层列表*/
  public floorNames   : Array<any>;  /*大楼楼层名称列表*/
  public searchFloor  : Floor;
  public pageNo       : number;
  public pageSize     : number = 5;
  public total        : number = 0;
  public isViewImg    : boolean = true;
  public imgWidth     : number = 500;
  public imgSrcView   : string;
  public copyFloors   : any;
  public newFloor     : Floor = new Floor();
  public isOpenNewView: boolean =false;
  public file         : any;
  public rule         : sndCatalog = new sndCatalog();
  constructor(
    private globalCatalogService:GlobalCatalogService,
    private globalBuilding:GlobalBuildingService,
    private infoBuildingService:InfoBuildingService,
    private utilBuildingService:UtilBuildingService,
    private router: Router,
    private errorVoid:ErrorResponseService,
    public ipSetting: IpSettingService
  ) {
    this.building = globalBuilding.getVal();
    this.rule = this.globalCatalogService.getRole("security/basic");
  }

  ngOnInit() {
    this.globalBuilding.valueUpdated.subscribe(
      (val) =>{
        this.building = this.globalBuilding.getVal();
      }
    );
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("security/basic");
      }
    );
    this.initFloor();
  }
  initFloor(){
    this.floors = new Array<Floor>();
    this.copyFloors =[];
    let id =Number( this.router.url.split('/')[5]);
    this.searchFloor = new Floor();
    this.searchFloor.buildingId = id;
    this.searchFloor.floorNum = '';
    this.searchFloor.floorUse = '';
    this.getFloorNameListInfo(id);
    this.getFloorInfo(1);
  }
  /*获取楼层信息*/
  getFloorInfo(pageNo:number) {
    this.pageNo = pageNo;
    let copySearch = JSON.parse(JSON.stringify(this.searchFloor));
    if(this.searchFloor.floorNum === '') {
      copySearch.floorNum = undefined;
    }
    this.infoBuildingService.getFloorListMsg( copySearch, pageNo,this.pageSize)
      .subscribe(data =>{
        if(this.errorVoid.errorMsg(data)) {
          this.floors = data.data.infos;
          this.copyFloors = JSON.parse(JSON.stringify(this.floors));
          for( let i = 0;i<this.copyFloors.length;i++) {
            this.copyFloors[i].editStatus = false;
          }
          this.total = data.data.total;
        }
      });
  }
  /*获取楼层名称*/
  getFloorNameListInfo(id:number) {
    this.infoBuildingService.getFloorNameListMsg(id)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.floorNames = data.data;
        }
      });
  }
  search(){
    this.getFloorInfo(1);
  }
  /*查看大楼房间信息*/
  goToRoom(id){
    var url = this.router.url.replace('floor','room');
    this.router.navigate([url,id]);
  }
  /*查看图片*/
  viewImg(url:string){
    this.isViewImg = false;
    this.imgSrcView = url;
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
    if(this.copyFloors[index].editStatus){
      if($('.red').length === 0) {
        this.copyFloors[index].buildingId = this.building.id;
        this.infoBuildingService.updateFloor(this.copyFloors[index])
          .subscribe(data => {
            if (this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示' ,
                'mes': data.msg,
                'popType': 2 ,
                'imgType': 1 ,
                "callback": () => {
                  this.floors[index] = this.copyFloors[index];
                  $('#prese'+index).val('');
                  this.copyFloors[index].editStatus = false;
                },
                "cancel": () => {
                  this.floors[index] = this.copyFloors[index];
                  $('#prese'+index).val('');
                  this.copyFloors[index].editStatus = false;
                }
              });
            }
          })
      }else {
        confirmFunc.init({
          'title': '提示' ,
          'mes': '表单数据填写不完全',
          'popType': 0 ,
          'imgType': 2 ,
        });
      }
    }
  }
  /*删除信息*/
  delRoom(id) {
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1,
      'imgType': 3 ,
      "callback": () => {
        this.infoBuildingService.deleteFloor(id)
          .subscribe( data => {
            if(this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
                "callback": () => {
                  this.initFloor();
                },
                'cancel':() => {
                  this.initFloor();
                }
              });
            }
          });
      },
    });
  }
  /*文件图片上传*/
  prese_upload(files,index){
    var xhr = this.utilBuildingService.uploadImg(files[0],'floor',-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          this.copyFloors[index].imgPath = data.msg;
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
  /*新建楼层的楼层平面图上传*/
  presepic_upload(files){
    var xhr = this.utilBuildingService.uploadImg(files[0],'floor',-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
         this.newFloor.imgPath = data.msg;
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
    $('.form-control').removeClass('red');
    $('.error').fadeOut();
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
          if(this.errorVoid.errorMsg(data)){
            confirmFunc.init({
              'title': '提示' ,
              'mes': data.msg,
              'popType': 2 ,
              'imgType': 1 ,
              "callback": () => {
                $('#pressNew').val('');
                this.closeNewView();
                this.initFloor();
              },
              "cancel": () => {
                $('#pressNew').val('');
                this.closeNewView();
                this.initFloor();
              }
            });
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
  /*非空验证*/
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
