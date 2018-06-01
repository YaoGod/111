import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {Review, WorkflowService} from "../../service/workflow/workflow.service";
import {GlobalUserService} from "../../service/global-user/global-user.service";
import {IpSettingService} from "../../service/ip-setting/ip-setting.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-examine',
  templateUrl: './examine.component.html',
  styleUrls: ['./examine.component.css'],
  providers: [WorkflowService]
})
export class ExamineComponent implements OnInit {

  public search :Review;
  public pageNo: number;
  public pageSize: number;
  public total: number;
  public orderList: Array<Review>;
  public searchType: string;
  public industry:boolean;
  public typeList = [];
  public rule : any;
  public jurisdiction:any;
  constructor(
    public ipSetting:IpSettingService,
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private workflowService:WorkflowService,
    private globalUserService:GlobalUserService,
    private router: Router,
  ) {
    this.rule = this.globalCatalogService.getRole("system/examine");
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("系统管理/工单管理");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("system/examine");
        if(this.rule){
          this.getRule(this.rule.ID);
        }
      }
    );
    if(this.rule){this.getRule(this.rule.ID);}
    this.pageNo = 1;
    this.pageSize = 10;
    this.total = 0;
    this.search = new Review();
    this.search.type = "";
    this.search.status = 'going';
    this.search.createUserId = this.globalUserService.getVal().userid+"";
    this.orderList = [];
    this.getMyExamine(1);
    this.searchType = "going";
    this.getFlowTypeList();
  }

  getMyExamine(pageNo){
    this.pageNo = pageNo;
    this.workflowService.getReviewList(this.search,this.pageNo,this.pageSize)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.orderList = data.data.infos;
          this.total = data.data.total;
          this.searchType = this.search.status;
        }
      })
  }
  /*获取是否超级管理员*/
  getUserPower(){
    let url = '/portal/user/getIsAdmin';
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorResponseService.errorMsg(data)) {
        this.industry = data.data;
      }
    });
  }
  /*获取权限*/
  getRule(id){
    this.globalCatalogService.getCata(id,'system','')
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.jurisdiction = data.data;
        }
      })
  }

  getFlowTypeList(){
    let url = '/workflow/flow/getFlowTypeList';
    this.ipSetting.sendGet(url).subscribe(data=>{
      if(this.errorResponseService.errorMsg(data)){
        this.typeList = data.data;

      }
    })
  }
}
