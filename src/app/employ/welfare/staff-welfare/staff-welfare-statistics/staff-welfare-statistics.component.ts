import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Welfare } from '../../../../mode/welfare/Welfare.service';
import { GlobalCatalogService } from '../../../../service/global-catalog/global-catalog.service';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import { WelfareEmployeeService } from '../../../../service/welfare-employee/welfare-employee.service';
import { IpSettingService } from "../../../../service/ip-setting/ip-setting.service";
declare var confirmFunc:any;
declare var $: any;
@Component({
  selector: 'app-staff-welfare-statistics',
  templateUrl: './staff-welfare-statistics.component.html',
  styleUrls: ['./staff-welfare-statistics.component.css']
})
export class StaffWelfareStatisticsComponent implements OnInit {

  private pageNo    = 1;             /*当前页码*/
  private pageSize  = 10;             /*显示页数*/
  public  pages     : Array<number>; /*页码*/
  public  welfare   : Welfare;
  public  users     : Array<UserTarget>;
  public  search    : string;
  public  ip        :string;
  constructor(
    private router   : Router,
    private route    : ActivatedRoute,
    private ipSetting: IpSettingService,
    private globalCatalogService   : GlobalCatalogService,
    private errorResponseService   : ErrorResponseService,
    private welfareEmployeeService : WelfareEmployeeService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("员工服务/福利专区/福利信息统计");
    this.welfare = new Welfare();
    this.welfare.feedBackMsg = [];
    this.users = [];
    this.pages = new Array<number>();
    this.search = "";
    this.ip = this.ipSetting.ip;
    this.route.params.subscribe(data => {
      this.getWelfare(data.id);
      this.getWelfareCount(data.id);
    });
  }
  getWelfare(id){
    this.welfareEmployeeService.getWelfare(id)
      .subscribe(data=> {
        if(this.errorResponseService.errorMsg(data)){
          this.welfare = data.data;
        }
      })
  }
  getWelfareCount(id){
    this.welfareEmployeeService.getWelfareCount(id,'list',this.pageNo,this.pageSize,this.search)
      .subscribe(data=> {
        if(this.errorResponseService.errorMsg(data)){
          this.users = data.data.data.infos;
          let total = Math.ceil(data.data.data.total / this.pageSize);
          this.initPage(total);
        }
      })
  }
  exportExcel(){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否导出全部数据？',
      'popType': 1,
      'imgType': 3,
      "callback": () => {
        this.welfareEmployeeService.getWelfareCount(this.welfare.id,'excel',this.pageNo,this.pageSize,this.search)
      }
    });
  }
  searchInfo(){
    this.pageNo = 1;
    this.getWelfareCount(this.welfare.id);
  }
  /*页码初始化*/
  initPage(total){
    this.pages = new Array(total);
    for(let i = 0;i< total ;i++){
      this.pages[i] = i+1;
    }
  }
  /*页面显示区间5页*/
  pageLimit(page:number){
    if(this.pages.length < 5){
      return false;
    } else if(page<=5 && this.pageNo <= 3){
      return false;
    } else if(page>=this.pages.length -4 && this.pageNo>=this.pages.length-2){
      return false;
    } else if (page<=this.pageNo+2 && page>=this.pageNo-2){
      return false;
    }
    return true;
  }
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
  }
}
export class UserTarget{
  USERID   :number;
  USERNAME :string;
  SEX      :string;
  TELE_NUM :number;
  OA_EMAIL :string;
  DETAILS  :any;
}
