import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Building } from '../../../mode/building/building.service';
import { GlobalBuildingService } from '../../../service/global-building/global-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { InfoBuildingService } from '../../../service/info-building/info-building.service';
import { GlobalCatalogService } from '../../../service/global-catalog/global-catalog.service';
import { sndCatalog } from '../../../mode/catalog/catalog.service';
import * as $ from 'jquery';
declare var AMap:any;
declare var $:any;
declare var confirmFunc: any;
@Component({
  selector: 'app-msg-belong',
  templateUrl: './msg-belong.component.html',
  styleUrls: ['./msg-belong.component.css'],
  providers: [Building,sndCatalog]
})
export class MsgBelongComponent implements OnInit {

  public building:Building;  /*大楼信息*/
  public copyBuilding:Building = new Building();
  private mapEditStatus :boolean = false;
  public rule : sndCatalog = new sndCatalog();
  public map;
  public companyList:Array<string>;
  constructor(
    private globalCatalogService:GlobalCatalogService,
    private infoBuildingService:InfoBuildingService,
    private globalBuilding:GlobalBuildingService,
    private errorVoid:ErrorResponseService,
    private router: Router
  ) {
    this.building = globalBuilding.getVal();
    this.rule = this.globalCatalogService.getRole("security/basic");
  }

  ngOnInit() {
    /*大楼信息更新订阅*/
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
    let id = this.router.url.split('/')[5];
    this.getBuildingInfo(Number(id));
    this.companyList = ['市公司','武林分公司','江干分公司','西湖分公司','拱墅分公司','滨江分公司','下沙分公司',
      '萧山分公司','余杭分公司','富阳分公司','建德分公司','淳安分公司','桐庐分公司','临安分公司'];
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
    this.map = new AMap.Map('map',{
      zoom: 10,
      center:[120.323189,30.235673],
      resizeEnable: true,
    });
    this.map.plugin(['AMap.ToolBar','AMap.Geocoder'],() =>{
        let marker= new AMap.Marker({
          title: this.building.name,
          map: this.map
        });
        let geocoder = new AMap.Geocoder({});
        if(typeof(lat)!=="undefined" && typeof(lon)!=="undefined"
          && lat!== null && lon !== null && lat !==""&& lon!=="") {
          marker.setPosition([lat, lon]);
          this.map.setFitView();
        }
        let clickEventListener = this.map.on('click', (e) => {
          if (this.mapEditStatus) {
            this.map.remove(marker);
            marker= new AMap.Marker({
              title: this.building.name,
              map: this.map
            });
            this.copyBuilding.lat = e.lnglat.getLat();
            this.copyBuilding.lon = e.lnglat.getLng();
            let position = [this.copyBuilding.lon, this.copyBuilding.lat];
            marker.setPosition(position);
            this.map.setFitView();
            geocoder.getAddress(e.lnglat,(status, result)=>{
              if (status === 'complete') {
                console.log(result.regeocode.formattedAddress);
              }else{
                /*获取地址失败*/
              }
            });
          }
        });
      })
  }
  getAddress(position){
    this.map.plugin("AMap.Geocoder",()=>{
      let geocoder = new AMap.Geocoder({});
      geocoder.getAddress(position,(status, result)=>{
        if (status === 'complete' && result.info === 'OK') {
          console.log(result.regeocode.formattedAddress);
        }else{
          /*获取地址失败*/
        }
      });
    });
  }
  updateMarker(){
    this.showMap(this.copyBuilding.lon,this.copyBuilding.lat);
  }
  /*进入编辑*/
  initEdit(){
    if(!this.mapEditStatus){
      $('.ipt').fadeIn(700);
      $('.word').hide();
      $('.box-option').slideDown(500);
      this.copyBuilding = JSON.parse(JSON.stringify(this.building));
      this.mapEditStatus = true;
    }
  }
  /*取消操作*/
  closeEdit(){
    this.mapEditStatus = false;
    $('.ipt').hide();
    $('.word').fadeIn(600);
    $('.box-option').slideUp(100);
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
            },
            "cancel": () => {
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
