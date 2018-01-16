import { Component, OnInit } from '@angular/core';
import {InfoBuildingService} from "../../../service/info-building/info-building.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {Http} from "@angular/http";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";

@Component({
  selector: 'app-property-service',
  templateUrl: './property-service.component.html',
  styleUrls: ['./property-service.component.css'],
  providers: [InfoBuildingService,ErrorResponseService,UtilBuildingService]
})
export class PropertyServiceComponent implements OnInit {
  public rule:any;
  public jurisdiction:any;
  constructor(private http: Http,
              private errorVoid:ErrorResponseService,
              private utilBuildingService:UtilBuildingService,
              private globalCatalogService:GlobalCatalogService,
              private ipSetting  : IpSettingService
  ) {}

  ngOnInit() {
    this.getRule();
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'logistics','employ/logistics/property')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.rule = data.data[2];
        }
      })
  }
  /*获取权限*/
  private getQuan(){
    if(this.rule!=null){
      let SOFTWARES_URL =  "/portal/user/getCata/"+this.rule.ID+"/repair?url=";
      this.ipSetting.sendGet(SOFTWARES_URL).subscribe(data => {
          if(this.errorVoid.errorMsg(data)) {
            this.jurisdiction = data['data'][0];
          }
        });
    }
  }

}
