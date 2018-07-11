import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {ActivatedRoute} from "@angular/router";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
declare var $:any;
declare var confirmFunc:any;
@Component({
  selector: 'app-sanhuidetail',
  templateUrl: './sanhuidetail.component.html',
  styleUrls: ['./sanhuidetail.component.css']
})
export class SanhuidetailComponent implements OnInit {
  public ID:string;
  public eTime:string;
  public newCard = new CardInfo();
  public history:any;
  constructor(
    private route    : ActivatedRoute,
    private globalCatalogService:GlobalCatalogService,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
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
          // console.log(data);
          this.newCard = data.data;
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
  branchAttach:string;
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
