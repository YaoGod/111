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
  public editUserMsg:UserTarget;
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
    this.editUserMsg = new UserTarget();
  }
  getWelfare(id){
    this.welfareEmployeeService.getWelfare(id)
      .subscribe(data=> {
        if(this.errorResponseService.errorMsg(data)){
          this.welfare = data.data;
          if(this.welfare.feedBack === "是"){
            for(let i= 0;i<this.welfare.feedBackMsg.length;i++){
              this.welfare.feedBackMsg[i].list = this.welfare.feedBackMsg[i].list.split('|');
            }
          }
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
  /*添加窗口关闭*/
  closeView() {
    $('.form-control').removeClass('red');
    $('.error').fadeOut();
    $('.mask').css('display', 'none');
  }
  /*点击编辑反馈信息*/
  editFeedbackMsg(userMsg:UserTarget){
    $('.mask').css('display', 'block');
    this.editUserMsg = JSON.parse(JSON.stringify(userMsg));
    this.editUserMsg.WELFARE_ID = this.welfare.id;
    if(this.editUserMsg.DETAILS === null){
      this.editUserMsg.DETAILS = this.welfare.feedBackMsg;
    }
  }
  /*提交编辑信息*/
  submit(){
    for(let i = 0;i<this.editUserMsg.DETAILS.length;i++){
      this.verifyEmpty(this.editUserMsg.DETAILS[i].value,'listValue'+i);
    }
    if($('.red').length === 0) {
      this.welfareEmployeeService.updateFeedByAdmin(this.editUserMsg)
        .subscribe(data=>{
          if(this.errorResponseService.errorMsg(data)){
            confirmFunc.init({
              'title': '提示',
              'mes': data.msg,
              'popType': 0,
              'imgType': 1,
            });
            this.closeView();
            this.getWelfare(this.editUserMsg.WELFARE_ID);
          }
        })

    }
  }
  /*判断是否为空*/
  verifyEmpty( value, id){
    if(typeof (value) === "undefined" ||
      value === null ||
      value === ''){
      this.addErrorClass(id,'该值不能为空');
      return false;
    }else{
      this.removeErrorClass(id);
      return true;
    }
  }
  /* 添加错误信息*/
  private addErrorClass(id: string, error: string)  {
    $('#' + id).addClass('red');
    $('#' + id).parent().next('.error').fadeIn().html(error);
  }
  /*去除错误信息*/
  private  removeErrorClass(id: string) {
    $('#' + id).removeClass('red');
    $('#' + id).parent().next('.error').fadeOut();
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
  WELFARE_ID: number;
}
