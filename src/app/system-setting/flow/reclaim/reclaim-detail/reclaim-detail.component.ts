import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {InfoBuildingService} from "../../../../service/info-building/info-building.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {FlowConfigure, FlowService} from "../../../../service/flowConfigure/flow.service";
import {ActivatedRoute} from "@angular/router";

declare var $:any;
declare var confirmFunc:any;

@Component({
  selector: 'app-reclaim-detail',
  templateUrl: './reclaim-detail.component.html',
  styleUrls: ['./reclaim-detail.component.css'],
  providers: [FlowService, ErrorResponseService, InfoBuildingService]
})
export class ReclaimDetailComponent implements OnInit {

  public pageNo;
  public pageSize = 15;
  public total = 0;
  public length = 10;
  public groupList = [];
  public deptList:any;
  public search: FlowConfigure;
  public ID:number;
  constructor(
    private errorResponseService: ErrorResponseService,
    private route:ActivatedRoute,
    private flowService: FlowService,
    public ipSetting: IpSettingService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.ID = data.id;
    });
    this.search = new FlowConfigure();
    this.search.isdept = '';
    this.search.status = '';
    this.getUserGroup(this.ID);
  }

  /*获取指定用户的指定群组*/
  getUserGroup(userId) {
    this.flowService.getUserGroup(userId)
      .subscribe(data => {
        if (this.errorResponseService.errorMsg(data)) {
          this.groupList = data.data;
        }
      });
  }

}

