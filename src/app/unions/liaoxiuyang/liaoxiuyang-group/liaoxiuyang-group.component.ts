import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {GlobalUserService} from "../../../service/global-user/global-user.service";
import {Batch} from "../liaoxiuyang-batch/liaoxiuyang-batch.component";

@Component({
  selector: 'app-liaoxiuyang-group',
  templateUrl: './liaoxiuyang-group.component.html',
  styleUrls: ['./liaoxiuyang-group.component.css']
})
export class LiaoxiuyangGroupComponent implements OnInit {

  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  public searchInfo:Batch;
  public batches:any;
  public lines: Array<any>;
  constructor(
    public http:Http,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
    private globalUserService: GlobalUserService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("工会管理/疗休养/成团管理");
    this.searchInfo = new Batch();
    this.searchInfo.status = "check";
    this.searchInfo.lineId = "";
    this.batches = [];
    this.lines = [];
    this.getLines();
    this.searchInfoList(1);

  }
  getLines(){
    let url = "/soclaty/tourline/getTourLineSelect";
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        this.lines = data.data;
      }
    });
  }
  searchInfoList(number){
    this.pageNo = number;
    let url = '/soclaty/tourbatch/getTourBatchList/'+this.pageNo+'/'+this.pageSize;
    this.ipSetting.sendPost(url,this.searchInfo).subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        this.batches = data.data.infos;
        this.total = data.data.total;
      }
    });
  }

}
