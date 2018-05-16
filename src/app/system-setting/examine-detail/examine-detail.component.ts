import { Component, OnInit } from '@angular/core';
import {CheckMsg, Review, Segment, WorkflowService} from "../../service/workflow/workflow.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {ActivatedRoute, Params} from "@angular/router";
declare var $:any;
@Component({
  selector: 'app-examine-detail',
  templateUrl: './examine-detail.component.html',
  styleUrls: ['./examine-detail.component.css'],
  providers: [WorkflowService]
})
export class ExamineDetailComponent implements OnInit {

  public search :Review;
  public pageNo: number;
  public pageSize: number;
  public total: number;
  public order: Review;
  public history: Array<Segment>;
  public checkMsg: CheckMsg;
  constructor(
    private route: ActivatedRoute,
    private errorResponseService:ErrorResponseService,
    private workflowService:WorkflowService
  ) { }

  ngOnInit() {
    this.pageNo = 1;
    this.pageSize = 10;
    this.total = 0;
    this.search = new Review();
    this.order = new Review();
    this.order.note = "";
    this.history = [];
    this.checkMsg = new CheckMsg();
    if(typeof (this.route.params['_value']['id']) !== "undefined"){
      let tempid = 0;
      this.route.params
        .switchMap((params: Params) => this.order.id  = params['id'])
        .subscribe(() => {
          if (tempid === 0) {
            this.getReviewInfo(this.order.id);
            tempid++;
          }
        });
    }
  }
  getReviewInfo(id){
    this.workflowService.getReviewInfo(id)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.order = data.data;
          this.order.note = this.order.note.substring(0,this.order.note.length-1);
          this.history = JSON.parse(JSON.stringify(this.order.content));
        }
      })
  }
  /*判断流程进度节点*/
  setSegmentClass(index){
    if(this.order.schedule){
      if(index<this.order.schedule){
        return "process";
      }else if(index === this.order.schedule){
        return "active";
      }
    }
    return "";
  }
  /*打开审批窗口*/
  openModal(){
    $('#checkModal').show();
  }
  /*关闭审批窗口*/
  closeCheckModal(){
    $('.red').removeClass('red');
    $('.error').fadeOut();
    $('#checkModal').hide();
  }
  /*提交审批意见*/
  submit(){

  }
}
