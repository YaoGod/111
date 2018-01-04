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
  ) {
    this.rule = this.globalCatalogService.getRole("security/daily");
    this.getQuan();
  }

  ngOnInit() {
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("security/daily");

        this.getQuan();
      }
    );
  }
  /*获取权限*/
  private getQuan(){
    if(this.rule!=null){
      const SOFTWARES_URL =  this.ipSetting.ip + "/portal/user/getCata/"+this.rule.ID+"/repair";
      this.http.get(SOFTWARES_URL)
        .map(res => res.json())
        .subscribe(data => {
          if(this.errorVoid.errorMsg(data)) {
            this.jurisdiction = data['data'][0];
          }
        });
    }
  }

}
