import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {Http} from "@angular/http";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";

@Component({
  selector: 'app-bulletindetail',
  templateUrl: './bulletindetail.component.html',
  styleUrls: ['./bulletindetail.component.css']
})
export class BulletindetailComponent implements OnInit {

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

}
export class CardInfo {
  id: number; // 本条信息ID
  branchName:string; // 支部名称
  type:string; // 党建类型
  subType:string; /*活动类型*/
  month: string;// 月份
  shouldNum:number; // 支部党员人数
  factNum:number; // 参与人数
  fileContract:any; /*存放附件信息*/
  fileName=[];
  filePath=[];
}
