import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Building } from '../../../mode/building/building.service';
import { GlobalBuildingService } from '../../../service/global-building/global-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { InfoBuildingService } from '../../../service/info-building/info-building.service';
import * as $ from 'jquery';
declare var AMap:any;
declare var $:any;
declare var confirmFunc: any;
@Component({
  selector: 'app-msg-belong',
  templateUrl: './msg-belong.component.html',
  styleUrls: ['./msg-belong.component.css'],
  providers: [Building]
})
export class MsgBelongComponent implements OnInit {

  public building:Building;  /*大楼信息*/
  public copyBuilding:Building = new Building();
  private mapEditStatus :boolean = false;
  constructor(
    private infoBuildingService:InfoBuildingService,
    private globalBuilding:GlobalBuildingService,
    private errorVoid:ErrorResponseService,
    private router: Router
  ) {
    this.building = globalBuilding.getVal();
  }

  ngOnInit() {
    /*大楼信息更新订阅*/
    this.globalBuilding.valueUpdated.subscribe(
      (val) =>{
        this.building = this.globalBuilding.getVal();
      }
    );
    let id = this.router.url.split('/')[5];
    this.getBuildingInfo(Number(id));
  }
  /*获取大楼信息*/
  getBuildingInfo(id: number) {
    this.infoBuildingService.getBuildingMsg(id)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          this.building = data.data.buildingInfo;
          this.building.imgList = [];
          if(this.building.imgPath != null){
            this.building.imgList = this.building.imgPath.split(',');
          }
          if(typeof (data.data.attachInfo) !== 'undefined' && data.data.attachInfo !== null){
            this.building.buildDept = data.data.attachInfo.buildDept;
            this.building.buildTime = data.data.attachInfo.buildTime;
            this.building.payTime = data.data.attachInfo.payTime;
          }
          this.showMap(this.building.lon,this.building.lat);
          this.globalBuilding.setVal(this.building);
        }
      });
  }
  /*地图打点展示*/
  showMap(lat,lon){
    let map = new AMap.Map('map',{
      zoom: 10,
      center:[120.323189,30.235673]
    });
      map.plugin('AMap.ToolBar',() =>{
        if(typeof(lat)==="undefined" || typeof(lon)==="undefined"
          || lat=== null || lon === null ) {
            lat = 120.323;
            lon = 30.235;
        }
        let marker = new AMap.Marker({
          position: [lat, lon],
          title: this.building.name,
          map: map
        });
        let clickEventListener = map.on('click', (e) => {
          if (this.mapEditStatus) {
            this.copyBuilding.lat = e.lnglat.getLat();
            this.copyBuilding.lon = e.lnglat.getLng();
            let position = [this.copyBuilding.lon, this.copyBuilding.lat];
            marker.setPosition(position);
            map.setFitView();
          }
        });
        map.setFitView();
      })

  }
  updateMarker(){
    this.showMap(this.copyBuilding.lon,this.copyBuilding.lat);
  }
  /*进入编辑*/
  initEdit(){
    $('.ipt').css('display','inline-block');
    $('.word').css('display','none');
    $('.box-option').css('display','block');
    this.copyBuilding = JSON.parse(JSON.stringify(this.building));
    this.mapEditStatus = true;
  }
  /*取消操作*/
  closeEdit(){
    this.mapEditStatus = false;
    $('.ipt').css('display','none');
    $('.word').css('display','inline-block');
    $('.box-option').css('display','none');
    this.showMap(this.building.lon,this.building.lat);
  }
  /*表单提交*/
  submit() {
    this.infoBuildingService.updateBuilding(this.copyBuilding)
      .subscribe( data => {
        if(this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示',
            'mes': data.msg,
            'popType': 2,
            'imgType': 1,
            "callback": () => {
              if (data.msg === '更新成功') {
                this.building = this.copyBuilding;
                this.globalBuilding.setVal(this.building);
                this.closeEdit();
              }
            }
          })
        }
      })
  }
}
