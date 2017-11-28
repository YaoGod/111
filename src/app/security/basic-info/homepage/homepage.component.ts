import { Component, OnInit } from '@angular/core';
import { Building } from '../../../mode/building/building.service';
import { InfoBuildingService } from '../../../service/info-building/info-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';

import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import * as $ from 'jquery';
declare var $:any;
declare var confirmFunc: any;

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  providers: [InfoBuildingService,UtilBuildingService,ErrorResponseService]
})
export class HomepageComponent implements OnInit {
  public buildings :Array<Building>;
  public imgPaths : any;
  private pageNo = 1; /*当前页码*/
  private pageSize = 6; /*显示页数*/
  public search    :Building ; /*搜索字段*/
  public pages: Array<number>;
  public newBuilding = {
    imgPath: '',
    buildingId: '',
    name: '',
    address: '',
    belongTo:'',
    type: ''
  }
  constructor(
    private infoBuildingService:InfoBuildingService,
    private errorVoid:ErrorResponseService,
    private utilBuildingService:UtilBuildingService,
  ) { }

  ngOnInit() {
    this.search = new Building();
    this.search.type = '';
    this.pages = [];
    this.getBuildingMsg();
  }
  /*获取大楼列表*/
  getBuildingMsg(){
    this.infoBuildingService.getBuildingList(this.pageNo,this.pageSize,this.search)
      .subscribe(data =>{
        if(this.errorVoid.errorMsg(data)){
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
            this.getBuildingMsg();
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
  /*页码初始化*/
  initPage(total){
    this.pages = new Array(total);
    for(let i = 0;i< total ;i++){
      this.pages[i] = i+1;
    }
  }
  /*页面显示区间5页*/
  pageLimit(page:number){
    console.log(page);
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
    this.getBuildingMsg();
  }
  /*折叠动画*/
  slideToggle(){
    $('.panel').slideToggle();
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
                  this.pages =[];
                  this.pageNo = 1;
                  this.getBuildingMsg();
                }
              });
            }
          });
      }
    });
  }
}
