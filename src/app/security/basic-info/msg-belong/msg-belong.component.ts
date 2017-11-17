import { Component, OnInit } from '@angular/core';
import { Building } from '../../../mode/building/building.service';
import { GlobalBuildingService } from '../../../service/global-building/global-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { InfoBuildingService } from '../../../service/info-building/info-building.service';
import * as $ from 'jquery';
declare var AMap:any;
declare var $:any;
@Component({
  selector: 'app-msg-belong',
  templateUrl: './msg-belong.component.html',
  styleUrls: ['./msg-belong.component.css'],
  providers: [Building]
})
export class MsgBelongComponent implements OnInit {

  public building:Building;  /*大楼信息*/
  public copyBuilding:Building = new Building();
  constructor(
    private infoBuildingService:InfoBuildingService,
    private globalBuilding:GlobalBuildingService,
    private errorVoid:ErrorResponseService
  ) {
    this.building = globalBuilding.getVal();
  }

  ngOnInit() {
    /*大楼信息更新订阅*/
    this.globalBuilding.valueUpdated.subscribe(
      (val) =>{
        this.building = this.globalBuilding.getVal();
        this.showMap();
      }
    );
    this.showMap();
  }
  /*地图打点展示*/
  showMap(){
    let map = new AMap.Map('map',{
      zoom: 10,
      center: [120.159198,30.273623]
    });
    /*'AMap.Geolocation'*/
    map.plugin('AMap.ToolBar',() =>{
      let marker = new AMap.Marker({
        position: [this.building.lon,this.building.lat],
        title: this.building.name,
        map: map
      });
      map.setFitView();
    })
  }
  /*进入编辑*/
  initEdit(){
    $('.ipt').css('display','inline-block');
    $('.word').css('display','none');
    $('.box-option').css('display','block');
    this.copyBuilding = JSON.parse(JSON.stringify(this.building));
  }
  /*取消操作*/
  closeEdit(){
    $('.ipt').css('display','none');
    $('.word').css('display','inline-block');
    $('.box-option').css('display','none');
  }
  /*表单提交*/
  submit(){
    var data = this.copyBuilding;
    console.log(data);
    this.infoBuildingService.updateBuilding(data)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data.status)){
          if(data.msg === '更新成功'){
            this.building = this.copyBuilding;
            this.globalBuilding.setVal(this.building);
            this.closeEdit();
          }
          else{
            alert(data.msg);
          }
        }
      });
  }
}
