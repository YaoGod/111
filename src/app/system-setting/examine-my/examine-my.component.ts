import { Component, OnInit } from '@angular/core';
import {Review, WorkflowService} from "../../service/workflow/workflow.service";
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {GlobalUserService} from "../../service/global-user/global-user.service";
import {IpSettingService} from "../../service/ip-setting/ip-setting.service";

@Component({
  selector: 'app-examine-my',
  templateUrl: './examine-my.component.html',
  styleUrls: ['./examine-my.component.css'],
  providers: [WorkflowService]
})
export class ExamineMyComponent implements OnInit {

  public search :Review;
  public pageNo: number;
  public pageSize: number;
  public total: number;
  public orderList: Array<Review>;
  public isOwner: boolean;
  public typeList = [];
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private workflowService:WorkflowService,
    private globalUserService:GlobalUserService,
    public ipSetting:IpSettingService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("系统管理/全部工单");
    this.pageNo = 1;
    this.pageSize = 10;
    this.total = 0;
    this.search = new Review();
    this.search.type = "";
    // this.search.createUserId = this.globalUserService.getVal().userid+"";
    this.search.status = '';
    this.orderList = [];
    this.isOwner = false;
    this.getMyExamine(1);
    this.getFlowTypeList();
  }

  getMyExamine(pageNo){
    this.pageNo = pageNo;
    this.workflowService.getReviewList(this.search,this.pageNo,this.pageSize)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.orderList = data.data.infos;
          this.total = data.data.total;
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
