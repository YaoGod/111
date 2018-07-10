import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {Router} from "@angular/router";
declare var $:any;
declare var confirmFunc:any;
@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.css'],
  providers: [ErrorResponseService,]
})
export class LaunchComponent implements OnInit {

  public pageNo;
  public pageSize = 10;
  public total = 0;
  public entrySecurity:any;
  public beginTime:string;
  public endTime:string;
  public types : Array<string>;
  public record = new Person();
  public userInfo = new Info();
  public userId = localStorage.getItem('username');
  constructor(
    private router: Router,
    private globalCatalogService: GlobalCatalogService,
    private errorVoid:ErrorResponseService,
    public ipSetting  : IpSettingService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("工会管理/职代会提案发起表单");
    this.getUserInfo(this.userId);
    this.getListTime();
    // this.getBuildingList(0);
  }

  /*根据用户id获取会员信息*/
  getUserInfo(id){
      let url = "/soclaty/flow/getUserInfo/"+id;
      this.ipSetting.sendGet(url).subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.userInfo = data.data;
          // console.log(data.data);
          this.record.joinDate = this.userInfo.JOIN_DATE;
          this.record.userAge = this.userInfo.AGE;
          this.record.userWork = this.userInfo.WORK_TYPE;
          this.record.userPolitical = this.userInfo.POLITICAL_STATUS;
          this.record.userMemver = this.userInfo.MEMBER_SHIP;
          this.record.userCultural = this.userInfo.CULTURAL_LEVEL;
          this.record.userId = this.userId;
          this.record.userName = localStorage.getItem('showUserName');
          this.record.userDept = this.userInfo.DEPT_NAME;
        }
      });
  }
  /*获取开放时间信息*/
  getListTime(){
    let url = "/portal/cata/getCataList/1/999?cataName=工会管理";
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.entrySecurity = data.data.infos[0];
        if(this.entrySecurity){
          this.beginTime = this.entrySecurity.beginTime;
          this.endTime = this.entrySecurity.endTime;
        }
      }
    });
  }

  /*保存申请内容信息(申请授权）*/
  saveContent(){
      /*let temporary = JSON.parse(JSON.stringify(this.record));
      for(let i=0;i<temporary.length;i++){
        delete temporary[i].buildings;
        delete temporary[i].floorNums;
        delete temporary[i].rooms;
      }*/

  }

  /*提交*/
  submitPassword(){
    if (!this.verifyEmpty(this.record.theme,'theme')||!this.verifyEmpty(this.record.type,'type')||
      !this.verifyEmpty(this.record.cause,'cause')||!this.verifyEmpty(this.record.suggest,'suggest')){
      return false;
    }
    let url = '/soclaty/flow/addSoclatyFlow';
    let postData = JSON.parse(JSON.stringify(this.record));
    postData.handleUrl = '/hzportal/unions/congress/list';
      this.ipSetting.sendPost(url,postData).subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          // console.log(data);
          confirmFunc.init({
            'title': '提示',
            'mes': data.msg,
            'popType': 2,
            'imgType': 1,
          });
          this.router.navigate(['hzportal/unions/congress/list']);
        }
      });
  }
  close(){
    $('.mask,.mask1,.mask2').hide();
    $('.error').html('');
  }

  /*非空验证*/
  verifyEmpty( value, id?){
    if(typeof (value) === "undefined" || value === null || (value&&value.toString().trim() === '')){
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
export class Person{
  id: number;
  userId: string;
  userName: string;
  userDept: string;
  joinDate: string;
  userPolitical: string;
  userCultural:string;
  userMemver:string;
  userAge:string;
  userWork:string;

  status:string;// 提案状态
  hostDeptName:string;// 主办部门名字
  hostDeptId:string; // 主办部门编号
  helpDeptId:string; // 协办部门编号
  helpDeptName:string; // 协办部门名字
  handleUrl:string; // 跳转链接
  HANGDLE_CONTENT:Array<string>; // 提案处理情况数组
  PLAN_CONTENT:any; // 实施情况数组
  SCHEDULE:string; // 流程当前环节
  HANDLE_USER_ID:string; // 当前处理人员
  HANDLE_USER_ALL:string; // 已处理人员
  FATHER_ID:string; // 父级提案
  createSatisfled: string; // 发起人满意度
  CREATE_USER_ASSESS: string; // 发起人满意评价
  HANDLE_URL: string; // 流程处理跳转
  theme: string; // 提案主题
  type: string; // 提案类别
  cause : string; // 原因说明
  suggest:string;// 建议
}
export class Info {
  id: number; // 本条信息ID
  AGE:string;
  BIRTHDAY:string;
  CULTURAL_LEVEL:string;
  DEPT_NAME:string;
  JOIN_DATE:string;
  MEMBER_SHIP:string;
  POLITICAL_STATUS:string;
  SEX:string;
  WORK_TYPE:string;
}
