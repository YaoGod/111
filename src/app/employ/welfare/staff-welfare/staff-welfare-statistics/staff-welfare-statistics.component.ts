import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Welfare } from '../../../../mode/welfare/welfare.service';
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

  public pageNo    = 1;             /*当前页码*/
  public pageSize  = 10;             /*显示页数*/
  public  total    = 0;               /*页码*/
  public  welfare  : Welfare;
  public  users    : Array<UserTarget>;
  public  search   : string;
  public  ip       :string;
  constructor(
    private router   : Router,
    private route    : ActivatedRoute,
    private ipSetting: IpSettingService,
    private globalCatalogService   : GlobalCatalogService,
    private errorResponseService   : ErrorResponseService,
    private welfareEmployeeService : WelfareEmployeeService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("员工服务/惊喜专区/爱统计信息统计");
    this.welfare = new Welfare();
    this.welfare.feedBackMsg = [];
    this.users = [];
    this.search = "";
    this.ip = this.ipSetting.ip;
    this.route.params.subscribe(data => {
      this.getWelfare(data.id);
    });
  }
  getWelfare(id){
    this.welfareEmployeeService.getWelfare(id)
      .subscribe(data=> {
        if(this.errorResponseService.errorMsg(data)){
          this.welfare = data.data;
          this.getWelfareCount(1);
        }
      })
  }
  getWelfareCount(pageNo){
    this.pageNo = pageNo;
    this.welfareEmployeeService.getWelfareCount(this.welfare.id,'list',this.pageNo,this.pageSize,this.search)
      .subscribe(data=> {
        if(this.errorResponseService.errorMsg(data)){
          this.users = data.data.data.infos;
          this.total =data.data.data.total;
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
  back(){
    history.go(-1);
  }
}
export class UserTarget{
  USERID   :number;
  USERNAME :string;
  SEX      :string;
  TELE_NUM :number;
  OA_EMAIL :string;
  DETAILS  :any;
  CREATE_TIME: string;
}
