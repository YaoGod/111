import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {InfoBuildingService} from "../../service/info-building/info-building.service";
import {UtilBuildingService} from "../../service/util-building/util-building.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {sndCatalog} from "../../mode/catalog/catalog.service";
import {Building} from "../../mode/building/building.service";
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../service/ip-setting/ip-setting.service";
declare var $:any;
declare var confirmFunc: any;

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  providers: [InfoBuildingService,UtilBuildingService,ErrorResponseService,sndCatalog]
})
export class UploadComponent implements OnInit {
  public buildings :Array<any>;
  public buidingNames: Array<any>;
  public imgPaths : any;
  public pageNo = 1; /*当前页码*/
  public pageSize = 6; /*显示页数*/
  public total = 0;
  public search    :Building ; /*搜索字段*/
  public newBuilding = new Building();
  public rule : sndCatalog = new sndCatalog();
  public companyList: Array<string>;
  constructor(
    private infoBuildingService:InfoBuildingService,
    private errorVoid:ErrorResponseService,
    private utilBuildingService:UtilBuildingService,
    private globalCatalogService:GlobalCatalogService,
    public  ipSetting:IpSettingService
  ) {
    this.rule = this.globalCatalogService.getRole("security/basic");
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("党建管理/工作台账上传");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("security/basic");
      }
    );
    this.search = new Building();
    this.search.type = '';
    this.search.use = '';

    this.buildings = [
      {id: 1,url:'sanhui',name:'（一）、三会一课',imgPath:'sanhuiyike.png'},
      {id: 2,url:'liuhao',name:'（二）、“六好”党支部建设月报',imgPath:'liuhaoyuebao.png'},
      {id: 3,url:'bulletin',name:'（三）、"主题党日"活动简报',imgPath:'huodongjianbao.png'},
      {id: 4,url:'practice',name:'（四）、党建实践案例',imgPath:'shijiananli.png'},
      {id: 5,url:'dangwei',name:'（五）、党委委员调研党支部信息',imgPath:'dangweidiaoyan.png'},
      {id: 6,url:'jihua',name:'（六）、党支部工作计划和总结',imgPath:'jihuazongjie.png'},
      {id: 7,url:'subunit',name:'（七）、党支部岗区队建设情况',imgPath:'quduijianshe.png'},
      {id: 8,url:'subunit',name:'（八）、支部建设',imgPath:'quduijianshe.png'},
      {id: 9,url:'subunit',name:'（九）、学习时间',imgPath:'quduijianshe.png'},
      ]
  }
}
