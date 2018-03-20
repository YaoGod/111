import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import * as echarts from 'echarts';
import {WorkspaceMydeskService} from "../../../service/workspace-mydesk/workspace-mydesk.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
@Component({
  selector: 'app-workspace-home',
  templateUrl: './workspace-home.component.html',
  styleUrls: ['./workspace-home.component.css'],
  providers: [WorkspaceMydeskService, ErrorResponseService,UtilBuildingService]
})
export class WorkspaceHomeComponent implements OnInit {

  public count          : number;
  public pendings       : Array<any>;
  public serviceCenters : Array<any>;
  public myServiceCenter: string = "";
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService: ErrorResponseService,
    private workspaceMydeskService:WorkspaceMydeskService,
    private utilBuildingService:UtilBuildingService,
  ) { }

  ngOnInit() {
    this.count = 0;
    this.pendings = [];
    this.globalCatalogService.setTitle("员工服务/我的工作台");
    this.getBalance();
    this.getHandlingOrder();
/*    this.getUserConsume("costHistoryChart","cost");
    this.getUserConsume("costDashHistoryChart","laundry");*/
    this.getServiceCenter();
    this.getMyServiceCenter();
  }

  linkCost(){
    this.router.navigate(['/hzportal/employ/workspace/consume/consAccount']);
  }
  linkCostDash(){
    this.router.navigate(['/hzportal/employ/workspace/consume/washAccount']);
  }
  linkPendingCost(key){
    if(key === "待处理订单"){
      this.router.navigate(['/hzportal/employ/workspace/orderhand','DOrder']);
    }else if(key === "待处理工单"){
      this.router.navigate(['/hzportal/employ/workspace/orderhand','GOrder']);
    }
  }
  /*获取用户总资产*/
  getBalance(){
    this.workspaceMydeskService.getBalance()
      .subscribe((data) => {
        if(this.errorResponseService.errorMsg(data)){
          this.priceChartInit("priceChart",data.data);
        }
    })
  }
  /*总资产分布情况 饼图*/
  priceChartInit(id,data){
    let legendData = [];
    let seriesData = [];
    for(let i = 0; i < data.length;i++){
      legendData[i] = data[i].key;
      seriesData[i] = {};
      seriesData[i].name = data[i].key;
      seriesData[i].value = data[i].value === null?0:data[i].value;
      this.count += seriesData[i].value;
    }
    let option = {
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} 元({d}%)"
      },
      legend: {
        x : 'right',
        y : 'top',
        right: '10%',
        orient : 'vertical',
        type : 'scroll',
        data:legendData
      },
      calculable : true,
      series : [
        {
          name:'资产分布情况',
          type:'pie',
          radius : [15, 50],
          center : ['65%', '50%'],
          roseType : 'radius',
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
          lableLine: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
          itemStyle:{
            normal:{
              color: function(params) {
                // build a color map as your need.
                let colorList = ['#568dfe','#e456fe','#f7894d','#f7d54d','#9df74d','#55ff33','#00ffae','#1b6bff'];
                return colorList[params.dataIndex]
              }
            }
          },
          data:seriesData
        }
      ]
    };
    let includePriceChart = echarts.init(document.getElementById(id));
    includePriceChart.setOption(option);
  }
  /*待处理事项列表*/
  getHandlingOrder(){
    this.workspaceMydeskService.getHandlingOrder()
      .subscribe((data)=>{
        if(this.errorResponseService.errorMsg(data)){
          this.pendings = data.data;
        }
      })
  }
  /*获取资产按月统计数据*/
  getUserConsume(chartID,type){
    this.workspaceMydeskService.getUserConsume(type)
      .subscribe((data)=>{
        if(this.errorResponseService.errorMsg(data)){
          if(data.data.length>0){
            this.costChart(chartID,data.data);
          }
        }
      })
  }
  /*资产明细统计表*/
  costChart(id,data){
    let legendData = [];
    let seriesData = [];
    for(let i = 0; i < data.length;i++){
      legendData[i] = data[i].CONSUME_TIME;
      seriesData[i] = data[i].CONSUME_NUM;
    }
    let option = {
      tooltip : {
        trigger: 'axis',
        axisPointer : {
          type : 'shadow'
        }
      },
      xAxis : [
        {
          show : false,
          type : 'value'
        }
      ],
      yAxis : [
        {
          type : 'category',
          position : 'right',
          axisTick : {show: false},
          textStyle: {
            fontSize: 20,
            color: '#999'
          },
          axisLine :{
            show: 'false'
          },
          data : legendData /*['7月','8月','9月','10月','11月','12月']*/
        }
      ],
      series : [
        {
          name:'支出',
          type:'bar',
          stack: '总量',
          x : 'left',
          y: 'center',
          label: {
            normal: {
              show: true
            }
          },
          itemStyle:{
            normal:{
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                  offset: 0, color: 'rgba(50, 147, 219, .9)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(50, 147, 219, .2)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          data: seriesData /*[320, 302, 341, 374, 390, 450]*/
        }
      ]
    };
    let includeCostChart = echarts.init(document.getElementById(id));
    includeCostChart.setOption(option);
  }
  /*获取服务中心列表*/
  getServiceCenter(){
    this.workspaceMydeskService.getServiceCenter()
      .subscribe((data)=>{
        if(this.errorResponseService.errorMsg(data)){
          this.serviceCenters = data.data;
        }
      });
  }
  /*获取默认的服务中心*/
  getMyServiceCenter(){
    this.utilBuildingService.getServiceCenter()
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          if(typeof (data.data)!== "undefined"){
            this.myServiceCenter = data.data;
          }
      }
      })
  }
  changeMyService(){
    if(this.myServiceCenter !== ""){
      this.workspaceMydeskService.setMyService(this.myServiceCenter)
        .subscribe(data=>{
          if(this.errorResponseService.errorMsg(data)){
            if(data.msg!=="操作成功"){
              this.getMyServiceCenter();
            }
          }
        })
    }
  }
}
