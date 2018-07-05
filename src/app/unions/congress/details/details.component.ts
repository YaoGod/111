import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
declare var $:any;
declare var confirmFunc:any;

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  public ID:string;
  public eTime:string;
  public newCard = new CardInfo();
  public history:any;
  public userInfo = new CardInfo();
  constructor(
    private route    : ActivatedRoute,
    private globalCatalogService:GlobalCatalogService,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("工会管理/职代会提案详情");
    this.route.params.subscribe(data => {
      this.getUserInfo(data.id);
    });
    // this.getUserInfo();
  }
  /*获取当前id的提案内容*/
  getWelfare(id){
    let url = "/party/report/detail/"+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        // console.log(data);
        this.newCard = data.data;
      }
    });

  }
  /*获取当前id的提案内容*/
  getUserInfo(id){
    let url = "/soclaty/flow/getSoclatyFlowInfo/"+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.userInfo = data.data;
      }
    });

  }
  /*判断textarea的行数自适应*/
  definedRows(){
    let length = $("#content").val().split(/\r?\n/).length;
    let index = $("#content").val().indexOf($("#content").val().split(/\r?\n/));
    index++;
    return length+1;
  }
}
export class CardInfo {
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
  createTime:string;
  HANGDLE_CONTENT:Array<string>; // 提案处理情况数组
  PLAN_CONTENT:any; // 实施情况数组
  schedule:string; // 流程当前环节
  HANDLE_USER_ID:string; // 当前处理人员
  HANDLE_USER_ALL:string; // 已处理人员
  FATHER_ID:string; // 父级提案
  createSatisfled: string; // 发起人满意度
  createUserAssess: string; // 发起人满意评价
  hadeleUrl: string; // 流程处理跳转
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
