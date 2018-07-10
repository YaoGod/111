import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {RequestContent, SearchInfo} from "../congflow/congflow.component";

@Component({
  selector: 'app-congflow-detail',
  templateUrl: './congflow-detail.component.html',
  styleUrls: ['./congflow-detail.component.css']
})
export class CongflowDetailComponent implements OnInit {

  public flow:SearchInfo;
  constructor(
    private route    : ActivatedRoute,
    private globalCatalogService:GlobalCatalogService,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
  ) { }

  ngOnInit() {
    this.flow = new SearchInfo();
    this.flow.planContent = new RequestContent();
    this.flow.hangdleContent = new RequestContent();
    this.globalCatalogService.setTitle("工会管理/职代会工单详情");
    this.route.params.subscribe(data => {
      this.getCongflowInfo(data.id);
    });
    // this.getUserInfo();
  }
  /*获取当前id的提案内容*/
  getCongflowInfo(id){
    let url = "/soclaty/flow/getSoclatyFlowInfo/"+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.flow = data.data;
      }
    });

  }

}
