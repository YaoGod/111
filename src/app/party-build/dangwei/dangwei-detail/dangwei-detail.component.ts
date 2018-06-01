import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-dangwei-detail',
  templateUrl: './dangwei-detail.component.html',
  styleUrls: ['./dangwei-detail.component.css']
})
export class DangweiDetailComponent implements OnInit {
  public ID:string;
  public eTime:string;
  public newCard:any;// = new CardInfo();
  public history:any;
  constructor(
    private route: ActivatedRoute,
    private globalCatalogService:GlobalCatalogService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("党建管理/党委");
    this.route.params.subscribe(data => {
      this.getWelfare(data.id);
    });
  }
  /*获取当前id的会议内容*/
  getWelfare(id){
    this.newCard = new CardInfo();
    this.newCard.id = id+1;
    this.newCard.branchName = "杭分移动市场部党支部";
    this.newCard.fileName = "中国中央党支部第一文件";
    this.newCard.month = id+1;
    this.newCard.partyWorkerName = "毛建设";
    this.newCard.themeTitle = "关于陈东尔同志岗位调动反响调研";
  }

}
export class CardInfo {
  id: number; // 本条信息ID
  branchName:string; // 支部名称
  type:string; // 会议类型
  month: string;// 月份

  bTime:string; // 开始时间
  eTime:string; // 结束时间
  compere:string; // 主持人
  recorder:string; // 记录人
  shouldNum:number; // 应到人数
  factNum:number; // 实到人数
  absentNum:number; // 缺席人数
  reason:string; // 缺席原因
  theme:string; // 会议主题
  note:string; // 会议议程
}
