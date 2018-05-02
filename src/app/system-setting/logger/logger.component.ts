import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {Logger} from "../../mode/logger/logger.service";
import {UserPortalService} from "../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import * as echarts from 'echarts';
@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements OnInit {

  public pageNo;
  public pageSize = 10;
  public total = 0;
  public loggers : Array<Logger>;
  public search: Logger;
  public moduleList;
  public moduleCounts;
  public select :Logger;
  public selectPageNo = 1;
  public selectPages = [];
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("系统管理/日志管理");
    this.loggers = [];
    this.search = new Logger();
    this.search.module = '';
    let today = new Date().toJSON().substr(0,10);
    this.search.bTime = today;
    this.search.eTime = '';
    this.search.userDept = "";
    this.search.userName = "";
    this.select = new Logger();
    this.select.bTime = "";
    this.select.eTime = today;
    this.select.userDept = "";
    this.select.userName = "";
    this.moduleCounts = [];
    this.getModuleList();
    this.getSystemLogger(1);
    this.getAccessNum();
  }
  /*获取类型下拉列表*/
  getModuleList(){
    this.userPortalService.getModuleList()
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.moduleList = data.data;
        }
      })
  }
  /*获取日志列表*/
  getSystemLogger(pageNo){
    this.pageNo = pageNo;
    this.userPortalService.getSysLog(this.pageNo,this.pageSize,this.search)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.loggers = data.data.infos;
          this.total = data.data.total;
        }
      })
  }
  /*导出*/
  exportSysLog(){
    return this.userPortalService.exportSysLog(this.pageNo,this.pageSize,this.search);
  }
  getAccessNum(){
    this.userPortalService.getAccessNum(this.select,this.selectPageNo,10)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.moduleCounts = data.data.infos;
          let length = data.data.total/10;
          this.selectPages = [];
          for(let i = 0;i<length;i++){
              this.selectPages[i] = i+1;
          }
          this.countChartInit('moduleCountChart',this.moduleCounts)
        }
      })
  }
  countChartInit(id,data){
    let legendData = [];
    let seriesData = [];
    for(let i = 0;i<data.length;i++){
      legendData.push(data[i].OPERATION_MODULE);
      seriesData.push(data[i].NUM);
    }
    let option = {
      title : {
        text: '各模块访问量统计',
        padding: [5,5,20,5],
        itemGap: 15,
        x: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bolder',
          color: '#4b87d4'
        }
      },
      tooltip : {
        trigger: 'item'
      },
      calculable: true,
      grid: {
        borderWidth: 0,
        y: 80,
        y2: 60
      },
      xAxis : [
        {
          show : true,
          type : 'category',
          data : legendData,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#FFFFFF'
            }
          },
          axisLabel: {
            interval: 0,
            rotate: -15,
            textStyle:{
              color: '#fe90bd'
            }
          }
        }
      ],
      yAxis : [
        {
          show : false,
          type : 'value',
        }
      ],
      series : [
        {
          name:'访问量',
          type:'bar',
          data:seriesData,
          itemStyle: {
            normal: {
              borderRadius: 5,
              color : '#fe90bd',
              label : {
                show : true,
                position: 'top',
              }
            }
          },
          barMaxWidth: 60
        }
      ]
    };
    let includePriceChart = echarts.init(document.getElementById(id));
    includePriceChart.setOption(option);
  }
}
