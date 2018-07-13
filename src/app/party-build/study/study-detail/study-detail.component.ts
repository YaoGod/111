import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {Http} from "@angular/http";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {CardInfo} from "../study-list/study-list.component";
@Component({
  selector: 'app-study-detail',
  templateUrl: './study-detail.component.html',
  styleUrls: ['./study-detail.component.css']
})
export class StudyDetailComponent implements OnInit {


  public ID:string;
  public eTime:string;
  public newCard = new CardInfo();
  constructor(
    public http:Http,
    public ipSetting:IpSettingService,
    private route    : ActivatedRoute,
    public errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("党建管理/学“习”时间");
    this.newCard = new CardInfo();
    this.route.params.subscribe(data => {
      this.getWelfare(data.id);
    });
  }
  /*获取当前id的会议内容*/
  getWelfare(id){
    let url = "/party/report/detail/"+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.newCard = data.data;
      }
    });
  }

}
