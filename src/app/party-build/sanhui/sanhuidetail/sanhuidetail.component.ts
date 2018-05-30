import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-sanhuidetail',
  templateUrl: './sanhuidetail.component.html',
  styleUrls: ['./sanhuidetail.component.css']
})
export class SanhuidetailComponent implements OnInit {
  public ID:string;
  public eTime:string;
  public newCard:any;// = new CardInfo();
  public history:any;
  constructor(
    private route    : ActivatedRoute,
    private globalCatalogService:GlobalCatalogService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("党建管理/工作台账上传");
    this.route.params.subscribe(data => {
      this.getWelfare(data.id);
    });
    this.newCard = {
      id:1,
      branchName:'中国移动市场部支委',
      type:'党员大会',
      theme:'研究党性原则的重要性',
      bTime:'2018/5/1 10:00',
      eTime:'2018/5/1 12:00',
      compere:'张三',recorder:'李四',
      shouldNum:5,
      factNum:4,
      absentNum:1,
      reason:'事假',
    }
  }
  /*获取当前id的会议内容*/
  getWelfare(id){

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
