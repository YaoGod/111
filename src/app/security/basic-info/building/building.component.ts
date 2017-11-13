import { Component, OnInit } from '@angular/core';
import {Building} from '../../../mode/building/building.service';
import { GlobalBuildingService } from '../../../service/global-building/global-building.service';
import { InfoBuildingService } from '../../../service/info-building/info-building.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css'],
  providers: [InfoBuildingService,Building]
})
export class BuildingComponent implements OnInit {
  public building:Building;  /*大楼信息*/
  private id;
  public type;
  constructor(
    private infoBuildingService:InfoBuildingService,
    private globalBuilding: GlobalBuildingService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  /*初始化时间钩子*/
  ngOnInit() {
    this.building = new Building;
    this.loading();
  }

  /*获取路由参数*/
  loading() {
    this.route.params // 通过注入的方式拿到route里的参数params
      .switchMap((params: Params) => this.id = params['id'])
      .subscribe(() => {
        // 每次id变换，对参数进行初始化
        this.getBuildingInfo(this.id);
      });
  }
  /*获取大楼信息*/
  getBuildingInfo(id:number){
    this.infoBuildingService.getBuildingMsg(id)
      .subscribe(data => {
        this.building = data.data.buildingInfo;
        if(typeof (data.data.attachInfo) !== 'undefined' && data.data.attachInfo !== null){
          this.building.buildDept = data.data.attachInfo.buildDept;
          this.building.buildTime = data.data.attachInfo.buildTime;
          this.building.payTime = data.data.attachInfo.payTime;
        }
        this.globalBuilding.setVal(this.building);
        this.type = this.setType();
      });
  }
  /*设置导向路由*/
  setNavActive(){
    let active = this.router.url.split('/')[6];
    if(active === 'property' || active === 'contract'){
      return true;
    }else{
      return false;
    }
  }
  /*设置类型*/
  setType(){
    console.log(this.building.type);
    if(this.building.type  === '自购'){
      return 'buy';
    }
    else if(this.building.type  === '自建'){
      return 'build';
    }
    else if(this.building.type  === '租赁'){
      return 'lease';
    }
    return '';
  }
}
