import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import * as echarts from 'echarts';
@Component({
  selector: 'app-workspace-home',
  templateUrl: './workspace-home.component.html',
  styleUrls: ['./workspace-home.component.css']
})
export class WorkspaceHomeComponent implements OnInit {

  constructor(
    private router:Router
  ) { }

  ngOnInit() {
    this.priceChartInit("priceChart");
    this.costChart("costHistoryChart");
    this.costChart("costDashHistoryChart");
  }

  linkCost(){
    this.router.navigate(['/hzportal/employ/workspace/consume/consAccount']);
  }
  linkCostDash(){
    this.router.navigate(['/hzportal/employ/workspace/consume/washAccount']);
  }
  linkPendingCost(){
    this.router.navigate(['/hzportal/employ/workspace/orderhand']);
  }
  /*总资产分布情况 饼图*/
  priceChartInit(id){
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
        data:[]
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
                let colorList = ['#568dfe','#7d56fe','#e456fe','#f7894d','#f7d54d','#9df74d','#55ff33','#00ffae','#1b6bff'];
                return colorList[params.dataIndex]
              }
            }
          },
          data:[]
        }
      ]
    };
    option.legend.data = ["消费账户","洗衣账户"];
    option.series[0].data = [
      {value:102.32, name:'消费账户'},
      {value:240.24, name:'洗衣账户'},
    ];
    let includePriceChart = echarts.init(document.getElementById(id));
    includePriceChart.setOption(option);
  }
  costChart(id){
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
          data : ['7月','8月','9月','10月','11月','12月']
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
          data:[320, 302, 341, 374, 390, 450]
        }
      ]
    };
    let includeCostChart = echarts.init(document.getElementById(id));
    includeCostChart.setOption(option);
  }
}
