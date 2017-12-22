import { Component, OnInit } from '@angular/core';
import { Building } from '../../../mode/building/building.service';
import { InfoBuildingService } from '../../../service/info-building/info-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { UtilBuildingService } from "../../../service/util-building/util-building.service";
import { GlobalCatalogService } from '../../../service/global-catalog/global-catalog.service';
import { sndCatalog } from '../../../mode/catalog/catalog.service';
import * as $ from 'jquery';
declare var $:any;
declare var confirmFunc: any;

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  providers: [InfoBuildingService,UtilBuildingService,ErrorResponseService,sndCatalog]
})
export class HomepageComponent implements OnInit {
  public buildings :Array<Building>;
  public imgPaths : any;
  public pageNo = 1; /*当前页码*/
  public pageSize = 6; /*显示页数*/
  public total = 0;
  public search    :Building ; /*搜索字段*/
  public newBuilding = {
    imgPath: '',
    buildingId: '',
    name: '',
    address: '',
    belongTo:'',
    type: ''
  };
  public rule : sndCatalog = new sndCatalog();
  constructor(
    private infoBuildingService:InfoBuildingService,
    private errorVoid:ErrorResponseService,
    private utilBuildingService:UtilBuildingService,
    private globalCatalogService:GlobalCatalogService,
  ) {
    this.rule = this.globalCatalogService.getRole("security/basic");
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("大楼管理/大楼基础信息");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("security/basic");
      }
    );
    this.search = new Building();
    this.search.type = '';
    this.getBuildingMsg(1);
  }
  /*获取大楼列表*/
  getBuildingMsg(pageNo){
    this.pageNo = pageNo;
    this.infoBuildingService.getBuildingList(pageNo,this.pageSize,this.search)
      .subscribe(data =>{
        if(this.errorVoid.errorMsg(data)){
          this.buildings = data.data.infos;
          this.total = data.data.total ;
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
  fadeBom(){
    $('.mask').show();
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position)=> {
        console.log("Latitude: " + position.coords.latitude + "<br />Longitude: " + position.coords.longitude);
      })
    }else{
      console.log("Geolocation is not supported by this browser.");
    }
  }
  closeMask(){
    $('.mask').hide();
    $('#prese').val('');
    this.newBuilding = {
      'imgPath': '',
      'buildingId': '',
      'name': '',
      'address': '',
      'belongTo': '',
      'type': ''
    }
  }
  subBuilding(){
    if(this.newBuilding.buildingId === '' || this.newBuilding.imgPath === '' ||
      this.newBuilding.name === '' || this.newBuilding.address === '' || this.newBuilding.belongTo === '' ||
      this.newBuilding.type === ''){
      confirmFunc.init({
        'title': '提示' ,
        'mes': "请把信息填写完整",
        'popType': 0 ,
        'imgType': 2 ,
      });
      return false;
    }
    this.infoBuildingService.addBuilding(this.newBuilding)
     .subscribe(data => {
        if(data['status'] === 0){
          if(data['msg'] === 'success'){
            confirmFunc.init({
              'title': '提示' ,
              'mes': '新增成功',
              'popType': 0 ,
              'imgType': 1 ,
            });
            this.closeMask();
            this.getBuildingMsg(1);
          }else{
            confirmFunc.init({
              'title': '提示' ,
              'mes': data['msg'],
              'popType': 0 ,
              'imgType': 2 ,
            });
          }
        }else if(data['status'] === 1){
            confirmFunc.init({
              'title': '提示' ,
              'mes': data['msg'],
              'popType': 0 ,
              'imgType': 2 ,
            });
        }
     })
  }
  /*文件图片上传*/
  prese_upload(files,index){
    var xhr = this.utilBuildingService.uploadImg(files[0],'building',-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          this.newBuilding.imgPath = data.msg;
          confirmFunc.init({
            'title': '提示' ,
            'mes': '上传成功',
            'popType': 0 ,
            'imgType': 1,
          });
        }
      }
    };
  }

  delete(id:number){
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除该大楼？',
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        this.infoBuildingService.deleteBuilding(id)
          .subscribe(data => {
            if(this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示' ,
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
                'callback': () => {
                  this.getBuildingMsg(1);
                },
                'cancel': () => {
                  this.getBuildingMsg(1);
                }
              });
            }
          });
      }
    });
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
