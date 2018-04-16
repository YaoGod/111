import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {Vote} from "../../../mode/vote/vote.service";
import {PublicresourceVoteService} from "../../../service/publicresource-vote/publicresource-vote.service";
import * as echarts from 'echarts';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
@Component({
  selector: 'app-vote-statistics',
  templateUrl: './vote-statistics.component.html',
  styleUrls: ['./vote-statistics.component.css'],
  animations: [
    trigger('boxAuto', [
      state('open', style({
        height: 420,
        opacity: 1
      })),
      state('close', style({
        height: 0,
        opacity: 0
      })),
      transition('open <=> close', animate('500ms ease-in')),
    ])
  ]
})
export class VoteStatisticsComponent implements OnInit {

  public vote: Vote;
  public search: User;
  public users: Array<User>;
  public pageNo: number = 1;
  public pageSize: number = 10;
  public total = 0;
  public openStatus: boolean;
  constructor(
    private router   : Router,
    private route    : ActivatedRoute,
    private globalCatalogService   : GlobalCatalogService,
    private errorResponseService   : ErrorResponseService,
    private publicresourceVoteService:PublicresourceVoteService,
  ) { }

  ngOnInit() {
    this.vote = new Vote();
    this.vote.options = [];
    this.search = new User();
    this.search.userId = "";
    this.users = [];
    this.globalCatalogService.setTitle("公共资源/投票信息统计");
    this.openStatus = true;
    let tempid = 0;
    this.route.params.subscribe(data => {
      if(tempid === 0){
        this.vote.id = data.id;
        this.getVoteInfo(data.id);
        this.getVoteCount(1);
        tempid ++;
      }
    });
  }
  /*获取投票信息*/
  getVoteInfo(id){
    this.publicresourceVoteService.getVoteInfo(id)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.vote = data.data;
          this.getVoteChartData();
        }
      })
  }
  /*获取用户投票列表*/
  getVoteCount(pageNo) {
    this.pageNo = pageNo;
    this.publicresourceVoteService.getVoteResultList(this.vote.id,this.search,this.pageNo,this.pageSize)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.users = data.data.infos;
          this.total = data.data.total
        }
      })
  }
  /*导出*/
  exportExcel(){
    this.publicresourceVoteService.exportVoteResultList(this.vote.id,this.search,this.pageNo,this.pageSize)
  }
  getVoteChartData(){
    this.publicresourceVoteService.getVoteResultCount(this.vote.id)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.countChartInit('voteChart',data.data);
        }
      })
  }
  countChartInit(id,data){
    let legendData = [];
    let seriesData = [];
    for(let i = 0;i<data.length;i++){
      legendData.push(data[i].RESULT);
      seriesData.push(data[i].NUM);
    }
    let nowTime = new Date().toLocaleString();
    let option = {
      title : {
        text: '投票结果统计图',
        subtext: '截止'+nowTime,
        padding: [5,5,20,5],
        itemGap: 15,
        x: 'center',
        y: 'top',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bolder',
          color: '#4b87d4'
        },
        subtextStyle: {
          color: '#aaa'
        }
      },
      tooltip : {
        trigger: 'axis'
      },
      toolbox: {
        show : true,
        feature : {
          mark : {show: true},
          dataView : {show: true, readOnly: true},
          magicType : {show: true, type: ['line', 'bar']},
          restore : {show: true},
          saveAsImage : {show: true}
        }
      },
      calculable : true,
      xAxis : [
        {
          type : 'category',
          data : legendData,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#8e9ea8'
            }
          },
          axisLabel: {
            interval: 0,
            rotate: -10
          }
        }
      ],
      yAxis : [
        {
          type : 'value',
          name : '票数',
          boundaryGap: [0,0.1],
          axisLine: {
            show: true,
            lineStyle: {
              color: '#8e9ea8'
            }
          }
        }
      ],
      series : [
        {
          name:'票数',
          type:'bar',
          data:seriesData,
          itemStyle: {
            normal: {
              borderRadius: 5,
              color : '#fb9678',
              label : {
                show : true,
                textStyle : {
                  fontSize : '20',
                  fontFamily : '微软雅黑',
                  fontWeight : 'bold'
                },
                position: 'insideBottom'
              }
            }
          },
          barMaxWidth: 60,
          markPoint : {
            effect: {
              show: true,
              type: 'bounce'
            },
            data : [
              {type : 'max', name: '最大值'},
              {type : 'min', name: '最小值'}
            ]
          },
          markLine : {
            data : [
              {type : 'average', name: '平均值'}
            ]
          }
        }
      ]
    };
    let includePriceChart = echarts.init(document.getElementById(id));
    includePriceChart.setOption(option);
  }
  changeOpenStatus(){
    this.openStatus = !this.openStatus;
  }
}

export class User{
  id       : number;
  userId   : string;
  userName : string;
  password : string;
  teleNum  : string;
  homeAddr : string;
  deptId   : string;
  deptName : string;
  sex      : string;
  oaEmail  : string;
  status   : string;
  userDept : string;
  resultList: Array<string>;
  createTime: string;
}
