import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {Review, WorkflowService} from "../../service/workflow/workflow.service";
import {GlobalUserService} from "../../service/global-user/global-user.service";
import {IpSettingService} from "../../service/ip-setting/ip-setting.service";

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
  constructor(
    public ipSetting:IpSettingService,
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private workflowService:WorkflowService,
    private globalUserService:GlobalUserService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("系统管理/工单管理");
    this.getUserPower();
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
  /*获取用户权限*/
  getUserPower(){
    let url = '/portal/user/getIsAdmin';
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorResponseService.errorMsg(data)) {
        this.industry = data.data;
      }
    });
  }

}
