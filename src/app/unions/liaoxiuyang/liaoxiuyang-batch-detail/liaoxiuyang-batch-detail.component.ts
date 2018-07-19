import { Component, OnInit } from '@angular/core';
import {Batch} from "../liaoxiuyang-batch/liaoxiuyang-batch.component";
import {ActivatedRoute} from "@angular/router";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";

@Component({
  selector: 'app-liaoxiuyang-batch-detail',
  templateUrl: './liaoxiuyang-batch-detail.component.html',
  styleUrls: ['./liaoxiuyang-batch-detail.component.css']
})
export class LiaoxiuyangBatchDetailComponent implements OnInit {

  public batch:Batch;
  constructor(
    private route    : ActivatedRoute,
    private globalCatalogService:GlobalCatalogService,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
  ) { }

  ngOnInit() {
    this.batch = new Batch();
    this.globalCatalogService.setTitle("工会管理/疗休养/批次管理/批次详情");
    this.route.params.subscribe(data => {
      this.getBatchInfo(data.id);
    });
  }
  getBatchInfo(id){
    let url = "/soclaty/tourbatch/getTourBatchInfo/"+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.batch = data.data;
        this.batch.lineName = this.batch.tourLine.name;
      }
    });

  }

}
