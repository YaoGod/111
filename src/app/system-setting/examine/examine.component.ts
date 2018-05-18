import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {Review, Segment, WorkflowService} from "../../service/workflow/workflow.service";

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
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private workflowService:WorkflowService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("系统管理/工单管理");
    this.pageNo = 1;
    this.pageSize = 10;
    this.total = 0;
    this.search = new Review();
    this.search.status = 'going';
    this.orderList = [];
    this.getMyExamine(1);
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
}
