import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {Http} from "@angular/http";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";

declare var $:any;
declare var confirmFunc:any;

@Component({
  selector: 'app-casedetail',
  templateUrl: './casedetail.component.html',
  styleUrls: ['./casedetail.component.css']
})
export class CasedetailComponent implements OnInit {

  public ID:string;
  public newCard = new CardInfo();
  constructor(
    public http:Http,
    public ipSetting:IpSettingService,
    private route    : ActivatedRoute,
    public errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("党建管理/工作台账上传");
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

  /*判断textarea的行数自适应*/
  definedRows(){
    let length = $("#content").val().split(/\r?\n/).length;
    let index = $("#content").val().indexOf($("#content").val().split(/\r?\n/));
    return length+1;
  }

}
export class CardInfo {
  id: number; // 本条信息ID
  branchName:string; // 支部名称
  type:string; // 党建类型
  month: string;// 月份
  subType:string; // 案例类型
  theme:string; // 案例名称
  note:string; // 案例概述
  fileContract:any;
}
