import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {IpSettingService} from "../../service/ip-setting/ip-setting.service";

@Component({
  selector: 'app-unionsindex',
  templateUrl: './unionsindex.component.html',
  styleUrls: ['./unionsindex.component.css']
})
export class UnionsindexComponent implements OnInit {

  public pageNo;
  public pageSize = 6;
  public total = 0;
  public votesTop: Array<any>;
  public votes: Array<any>;
  public wrapVotes: Array<any>;
  public search: any;
  public rule;
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    public ipSetting:IpSettingService,
  ) {
    this.rule = this.globalCatalogService.getRole("publicResource/vote");
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("工会管理/首页");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("publicResource/vote");
      });
    this.search = "";
    this.votes = [
      {
        id:1,name:'档案管理区',imgPath:'assets/image/bb2.png'
      },{
        id:2,name:'工作展示区',imgPath:'assets/image/bb3.png'
      },{
        id:3,name:'流程操作区',imgPath:'assets/image/bb1.png'
      }
    ];
    this.votesTop = [
      {
        id:1,url:"",title:'关于公布浙江大学120周年校庆返校报到点及联络人的通知'
      },{
        id:2,url:"",title:'关于举办学术大师大讲堂之詹姆斯·弗雷泽·司徒塔特教授专题讲座的通知'
      },{
        id:3,url:"",title:'关于开展“迎百廿校庆，溯求是记忆”系列活动的通知'
      },{
        id:4,url:"",title:'中国科学院院士潘建伟做客浙大求是大讲堂'
      },{
        id:4,url:"",title:'中国科学院院士潘建伟做客浙大求是大讲堂'
      },{
        id:4,url:"",title:'中国科学院院士潘建伟做客浙大求是大讲堂'
      },{
        id:4,url:"",title:'中国科学院院士潘建伟做客浙大求是大讲堂'
      },{
        id:4,url:"",title:'中国科学院院士潘建伟做客浙大求是大讲堂'
      },{
        id:4,url:"",title:'中国科学院院士潘建伟做客浙大求是大讲堂'
      },{
        id:4,url:"",title:'中国科学院院士潘建伟做客浙大求是大讲堂'
      },{
        id:4,url:"",title:'中国科学院院士潘建伟做客浙大求是大讲堂'
      },{
        id:4,url:"",title:'中国科学院院士潘建伟做客浙大求是大讲堂'
      },{
        id:4,url:"",title:'中国科学院院士潘建伟做客浙大求是大讲堂'
      },{
        id:4,url:"",title:'中国科学院院士潘建伟做客浙大求是大讲堂'
      },{
        id:4,url:"",title:'中国科学院院士潘建伟做客浙大求是大讲堂'
      }
    ];
    this.wrapVotes = [
      /*{
        title:'中国移动通信集团工会杭州分公司委员会员工关爱“五必访 四必贺”管理办法'
      },*/{
        title:'关于明确公司膳食委员会职责及推荐调整膳食委员会成员的通知',
        imgUrl:'assets/image/gg1.jpg'
      },{
        title:'中国移动杭州分公司职工小家、小小家健康活动设施管理办法',
        imgUrl:'assets/image/gg2.jpg'
      }
    ];
    this.getVoteList(1);
    this.getVoteCharts();
  }
  getVoteList(pageNo){
    this.pageNo = pageNo;
    /*this.publicresourceVoteService.getVoteList(this.pageNo,this.pageSize,this.search)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.votes = data.data.infos;
          this.total = data.data.total;
        }
      })*/
  }
  /*获取热门投票*/
  getVoteCharts(){
    /*this.publicresourceVoteService.getVoteCharts()
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.votesTop = data.data;
          this.wrapVotes = data.data;
        }
      })*/
  }
}
