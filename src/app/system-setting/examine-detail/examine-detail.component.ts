import { Component, OnInit } from '@angular/core';
import {Review, ReviewNote, Segment, WorkflowService} from "../../service/workflow/workflow.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {ActivatedRoute, Params} from "@angular/router";
import {User} from "../../mode/user/user.service";
import {checkAndUpdateBinding} from "@angular/core/src/view/util";
import {isNumber} from "util";
declare var $:any;
declare var confirmFunc:any;
@Component({
  selector: 'app-examine-detail',
  templateUrl: './examine-detail.component.html',
  styleUrls: ['./examine-detail.component.css'],
  providers: [WorkflowService]
})
export class ExamineDetailComponent implements OnInit {

  public search: Review;
  public order: Review;
  public history: Array<Segment>;
  public checkMsg: Segment;
  public userSelects: Array<User>;
  constructor(private route: ActivatedRoute,
              private errorResponseService: ErrorResponseService,
              private workflowService: WorkflowService) {
  }

  ngOnInit() {
    this.search = new Review();
    this.order = new Review();
    this.order.content = [];
    this.order.schedule = 0;
    this.order.content[0] = new Segment();
    this.order.note = "";
    this.history = [];
    this.checkMsg = new Segment();
    this.checkMsg.nodeReview = new ReviewNote();
    this.checkMsg.handleUserId = [];
    this.userSelects = [];
    if (typeof (this.route.params['_value']['id']) !== "undefined") {
      let tempid = 0;
      this.route.params
        .switchMap((params: Params) => this.order.id = params['id'])
        .subscribe(() => {
          if (tempid === 0) {
            this.getReviewInfo(this.order.id);
            tempid++;
          }
        });
    }
    console.log(111);
  }

  /*获取工单信息*/
  getReviewInfo(id) {
    this.workflowService.getReviewInfo(id)
      .subscribe(data => {
        if (this.errorResponseService.errorMsg(data)) {
          this.order = data.data;
          this.order.note = this.order.note.substring(0, this.order.note.length - 1);
          if (this.order.schedule + 1 < this.order.content.length) {
            this.getUserSelect(this.order.content[this.order.schedule + 1].groupId);
          }
          this.getHistoryReviewLogs(this.order.content);
        }
      })
  }

  /*判断流程进度节点*/
  setSegmentClass(index) {
    if (this.order.schedule) {
      if (index < this.order.schedule) {
        return "process";
      } else if (index === this.order.schedule) {
        if (this.order.schedule + 1 === this.order.content.length) {
          return "process";
        }
        return "active";
      }
    }
    return "";
  }

  /*获取下一审批人列表*/
  getUserSelect(id) {
    if (id) {
      this.workflowService.getUserSelect(id)
        .subscribe(data => {
          if (this.errorResponseService.errorMsg(data)) {
            this.userSelects = data.data;
          }
        })
    }
    else {
      this.userSelects = [];
    }
  }

  /*审批记录数据*/
  getHistoryReviewLogs(list) {
    let temp = [];
    let k = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].nodeReviews !== null && list[i].nodeReviews.length > 0) {
        for (let j = 0; j < list[i].nodeReviews.length; j++) {
          temp[k] = new Segment();
          temp[k].id = list[i].id;
          temp[k].name = list[i].name;
          temp[k].userId = list[i].nodeReviews[j].userId;
          temp[k].userName = list[i].nodeReviews[j].userName;
          temp[k].note = list[i].nodeReviews[j].note;
          temp[k].result = list[i].nodeReviews[j].result;
          temp[k].createTime = list[i].nodeReviews[j].createTime;
          k++;
        }
      }
      /*else{
       temp[k] = new Segment();
       temp[k].id = list[i].id;
       temp[k].name = list[i].name;
       k++;
       }*/

    }
    this.history = JSON.parse(JSON.stringify(this.quickSortArray(temp)));
  }
  quickSortArray(array){

    let quickSort = (arr)=> {
      if (arr.length <= 1) {
        return arr;
      }
      let midIndex = Math.floor(arr.length / 2);
      let midIndexVal = arr.splice(midIndex, 1)[0];
      let left = [];
      let right = [];
      for (let i = 0; i < arr.length; i++) {
        if (new Date( arr[i].createTime).getTime() > new Date( midIndexVal.createTime).getTime()) {
          left.push(arr[i]);
        }
        else {
          right.push(arr[i]);
        }
      }
      return quickSort(left).concat(midIndexVal, quickSort(right));
    };
    return quickSort(array);
  }
  /*非空验证*/
  verifyEmpty( value, id?){
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
  /*打开流程图的窗口*/
  openFlowModal(){
    $('#flowModal').show();
  }
  /*关闭流程图的窗口*/
  closeflowModal(){
    $('#flowModal').hide();
  }
  /*打开审批记录的窗口*/
  openHistoryModal(){
    $('#historyModal').show();
  }
  /*关闭审批记录的窗口*/
  closeHistoryModal(){
    $('#historyModal').hide();
  }
  /*打开审批窗口*/
  openModal(){
    $('#checkModal').show();
    // $(":radio[name='result'][value='pass']").prop("checked", "checked");
    this.checkMsg.nodeReview.result = "pass";
    this.setNote('同意');
  }
  /*关闭审批窗口*/
  closeCheckModal(){
    $('.red').removeClass('red');
    $('.error').fadeOut();
    $('#checkModal').hide();
    this.userSelects.forEach((user)=>{
      user.isBoolean = false;
    });
  }
  setNote(message){
    this.checkMsg.nodeReview.note = "【"+message+"】";
    this.checkMsg.handleUserId = null;
  }
  /*提交审批意见*/
  submit(){
    this.verifyEmpty(this.checkMsg.nodeReview.result,'result');
    this.checkMsg.handleUserId = [];
    this.userSelects.forEach((user)=>{
      if(user.isBoolean){this.checkMsg.handleUserId.push(user.userid);}
    });
    if(this.checkMsg.nodeReview.result === "pass"&&this.userSelects.length>0&&this.checkMsg.handleUserId.length === 0){
      confirmFunc.init({
        'title': '提示',
        'mes': "请选择下一处理人！",
        'popType': 2,
        'imgType': 2,
      });
      return false;
    }
    if($('.red').length === 0) {
      console.log(111);
      let index = this.order.schedule;
      let node = this.order.content[index];
      let postData = JSON.parse(JSON.stringify(this.checkMsg));
      if(postData.nodeReview.result === "pass"){
        postData.next = this.order.schedule+1;
        if(postData.handleUserId===null){
          postData.handleUserId = "";
        }
      }else if(postData.nodeReview.result === "fail"){
        postData.next = null;
        postData.handleUserId = "";
      }else if(postData.nodeReview.result === "rollback"){
        postData.next = this.order.schedule-1;
        if(node.groupId !== null){
          postData.handleUserId = this.history[this.history.length-1].userId;
        }else{
          postData.handleUserId = "";
        }
      }else if(postData.nodeReview.result === "rollbackTotal"){
        postData.next = 1;
        postData.handleUserId = this.order.createUserId;
      }
      this.workflowService.checkWorkFlow(postData,this.order.id,postData.handleUserId)
        .subscribe(data=>{
          if(this.errorResponseService.errorMsg(data)){
            confirmFunc.init({
              'title': '提示',
              'mes': data.msg,
              'popType': 2,
              'imgType': 1,
            });
            window.history.go(-1);
          }
        });
    }

  }
}
