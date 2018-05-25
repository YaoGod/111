import { Component, OnInit } from '@angular/core';
import {Review, ReviewNote, Node, WorkflowService, Group, Approve} from "../../service/workflow/workflow.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {ActivatedRoute, Params} from "@angular/router";
import {User} from "../../mode/user/user.service";
import {IpSettingService} from "../../service/ip-setting/ip-setting.service";
import {Http} from "@angular/http";
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
  public history: Array<ReviewNote>;
  public checkMsg: Approve;
  public userSelects: Array<User>;
  public groupId: number;
  public nowState: number;
  constructor(private http: Http,public route: ActivatedRoute,
              private errorResponseService: ErrorResponseService,
              private workflowService: WorkflowService,
              public ipSetting:IpSettingService,
  ) {
  }

  ngOnInit() {
    this.search = new Review();
    this.order = new Review();
    this.order.nodes = [];
    /*for (let i =0; i< 9;i++){
     this.order.nodes[i].group = new Group();
     }*/

    this.order.schedule = 0;
    this.nowState = 0;
    this.order.nodes[0] = new Node();
    this.order.nodes[0].group = new Group();
    this.order.note = "";
    this.checkMsg = new Approve();

    // this.checkMsg.group = new ReviewNote();
    // this.checkMsg.nodeReview = new ReviewNote();

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
  }

  /*获取工单信息*/
  getReviewInfo(id) {
    this.workflowService.getReviewInfo(id)
      .subscribe(data => {
        if (this.errorResponseService.errorMsg(data)) {
          this.order = data.data;
          this.history = this.order.workFlowHistory;
          if (this.order.note) {
            this.order.note = this.order.note.substring(0, this.order.note.length - 1);
          }
          for(let i=0;i<this.order.nodes.length;i++){
            if(this.order.schedule===this.order.nodes[i].flowNum){
              if(i===this.order.nodes.length-1){
                this.groupId = this.order.nodes[i].groupId;
                this.nowState = i;
              }else{
                this.groupId = this.order.nodes[i+1].groupId;
                this.nowState = i;
                this.getUserSelect(this.groupId);
              }

            }
          }
          /*if (this.order.schedule - 1 < this.order.nodes.length) {
            this.getUserSelect(this.groupId);/!*this.order.nodes[this.order.schedule - 1].groupId*!/
          }*/
        }
      })
  }

  /*判断流程进度节点*/
  setSegmentClass(index) {
    // console.log(index+"=="+this.nowState);
    if(this.order.status==='end'&&this.order.schedule===9){
      return "process";
    }else{
      if (index < this.nowState) {
        return "process";
      } else if (index === this.nowState) {
        /*if (this.order.schedule === 9) {
         return "process";
         }*/
        return "active";
      }else{
        return "";
      }
    }
  }
  exportInfo(){
    let url = this.ipSetting.ip+'/workflow/review/getReviewExcel/'+this.order.id;
    this.http.get(url)
    // .map(res => res.json())
      .subscribe(data => {
        window.location.href = url;

      });
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
    this.history = list;
    /*let temp = [];
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
     /!*else{
     temp[k] = new Segment();
     temp[k].id = list[i].id;
     temp[k].name = list[i].name;
     k++;
     }*!/

     }
     this.history = JSON.parse(JSON.stringify(this.quickSortArray(temp)));*/
  }

  quickSortArray(array) {
    let quickSort = (arr) => {
      if (arr.length <= 1) {
        return arr;
      }
      let midIndex = Math.floor(arr.length / 2);
      let midIndexVal = arr.splice(midIndex, 1)[0];
      let left = [];
      let right = [];
      for (let i = 0; i < arr.length; i++) {
        if (new Date(arr[i].createTime).getTime() > new Date(midIndexVal.createTime).getTime()) {
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
  verifyEmpty(value, id?) {
    if (typeof (value) === "undefined" ||
      value === null ||
      value === '') {
      this.addErrorClass(id, '该值不能为空');
      return false;
    } else {
      this.removeErrorClass(id);
      return true;
    }
  }

  /* 添加错误信息*/
  private addErrorClass(id: string, error: string) {
    $('#' + id).addClass('red');
    $('#' + id).parent().next('.error').fadeIn().html(error);
  }

  /*去除错误信息*/
  private  removeErrorClass(id: string) {
    $('#' + id).removeClass('red');
    $('#' + id).parent().next('.error').fadeOut();
  }

  /*打开流程图的窗口*/
  openFlowModal() {
    $('#flowModal').show();
  }

  /*关闭流程图的窗口*/
  closeflowModal() {
    $('#flowModal').hide();
  }

  /*打开审批记录的窗口*/
  openHistoryModal() {
    $('#historyModal').show();
  }

  /*关闭审批记录的窗口*/
  closeHistoryModal() {
    $('#historyModal').hide();
  }

  /*打开审批窗口*/
  openModal() {
    $('#checkModal').show();
    // $(":radio[name='result'][value='2']").prop("checked", "checked");
    this.checkMsg.result = "1";
    this.setNote('同意');
  }

  /*关闭审批窗口*/
  closeCheckModal() {
    $('.red').removeClass('red');
    $('.error').fadeOut().html('');
    $('#checkModal').hide();
    this.userSelects.forEach((user) => {
      user.isBoolean = false;
    });
  }

  setNote(message) {
    this.checkMsg.note = "【" + message + "】";
    this.checkMsg.handleUserId = null;
  }
  /*完结工单*/
  endWorkFlow(){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否确认完结该工单？',
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        let postData = JSON.parse(JSON.stringify(this.checkMsg));
        postData.id = this.order.id;
        postData.result = '1';
        postData.note = '【结单】';
        // console.log(postData);
        this.workflowService.checkWorkFlow(postData)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
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
    });
  }
  /*提交审批意见*/
  submit() {
    // this.verifyEmpty(this.checkMsg.result, 'result');
    this.checkMsg.handleUserId = '';
    this.userSelects.forEach((user) => {
      if (user.isBoolean) {
        this.checkMsg.handleUserId += user.userid + ',';
      }
    });
      // console.log(this.checkMsg.handleUserId+'=='+this.userSelects);
      // this.verifyEmpty(this.checkMsg.result, 'result');
     // console.log(this.checkMsg.result);
      if (this.checkMsg.result === "1" && this.userSelects.length > 0 && this.checkMsg.handleUserId === null) {
        confirmFunc.init({
          'title': '提示',
          'mes': "请选择下一处理人！",
          'popType': 2,
          'imgType': 2,
        });
        return false;
      }
      if ($('.red').length === 0) {
        let index = this.order.schedule;
        let node = this.order.nodes[index];
        let postData = JSON.parse(JSON.stringify(this.checkMsg));
        if (postData.result === "1") {
          if (postData.handleUserId === null) {
            postData.handleUserId = "";
          }
        } else if (postData.result === "4") {
          postData.handleUserId = "";
        } else if (postData.result === "2") {
          let inner = 0;
          if (this.history&&this.history.length>0) {
            for(let i=0;i<this.history.length;i++){
              if(this.order.schedule>this.history[i].schedule){
                inner = i;
                break;
              }
            }
            postData.handleUserId = this.history[inner].userid;
            // console.log(this.history[inner]);
          } else {
            postData.handleUserId = this.order.createUserId;
          }
        } else if (postData.result === "3") {
          postData.handleUserId = this.order.createUserId;
        }
        postData.id = this.order.id;
        this.workflowService.checkWorkFlow(postData)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
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
