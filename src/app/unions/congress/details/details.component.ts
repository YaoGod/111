import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
declare var $:any;
declare var confirmFunc:any;

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  public ID:string;
  public eTime:string;
  public newCard = new CardInfo();
  public history:any;
  public userInfo = new Info();
  public userId = localStorage.getItem('username');
  constructor(
    private route    : ActivatedRoute,
    private globalCatalogService:GlobalCatalogService,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("工会管理/职代会提案详情");
    this.route.params.subscribe(data => {
      this.getWelfare(data.id);
    });
    this.getUserInfo(this.userId);
  }
  /*获取当前id的会议内容*/
  getWelfare(id){
    let url = "/party/report/detail/"+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        // console.log(data);
        this.newCard = data.data;
      }
    });

  }
  /*获取当前id的会议内容*/
  getUserInfo(id){
    let url = "/soclaty/flow/getUserInfo/"+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.userInfo = data.data;
      }
    });

  }
  /*判断textarea的行数自适应*/
  definedRows(){
    let length = $("#content").val().split(/\r?\n/).length;
    let index = $("#content").val().indexOf($("#content").val().split(/\r?\n/));
    index++;
    return length+1;
  }
}
export class CardInfo {
  id: number; // 本条信息ID
  branchName:string; // 支部名称
  type:string; // 会议类型
  subType:string; // 子类型
  month: string;// 月份
  name:string; // 文件名称
  beginTime:string; // 开始时间
  endTime:string; // 结束时间
  host:string; // 主持人
  recorder:string; // 记录人
  shouldNum:number; // 应到人数
  factNum:number; // 实到人数
  absentNum:number; // 缺席人数
  reason:string; // 缺席原因
  theme:string; // 会议主题
  note:string; // 会议议程
  address:string; // 会议地点
  fileName=[];
  filePath=[];
  fileContract:any;
}
export class Info {
  id: number; // 本条信息ID
  AGE:string;
  BIRTHDAY:string;
  CULTURAL_LEVEL:string;
  DEPT_NAME:string;
  JOIN_DATE:string;
  MEMBER_SHIP:string;
  POLITICAL_STATUS:string;
  SEX:string;
  WORK_TYPE:string;
}
