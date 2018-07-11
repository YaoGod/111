import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {CardInfo} from "../jihua-list/jihua-list.component";

@Component({
  selector: 'app-jihua-detail',
  templateUrl: './jihua-detail.component.html',
  styleUrls: ['./jihua-detail.component.css']
})
export class JihuaDetailComponent implements OnInit {
  public ID:string;
  public eTime:string;
  public newCard:any;// = new CardInfo();
  public history:any;
  constructor(
    public ipSetting:IpSettingService,
    private route: ActivatedRoute,
    public errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
  ) { }

  ngOnInit() {
    this.newCard = new CardInfo();
    this.globalCatalogService.setTitle("党建管理/党支部工作计划和总结");
    this.route.params.subscribe(data => {
      this.getWelfare(data.id);
    });
  }
  /*获取当前id的会议内容*/
  getWelfare(id){
    this.ipSetting.sendGet("/party/report/detail/"+id)
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)) {
          this.newCard = data.data;
        }
      })
  }

}

