import { Component, OnInit } from '@angular/core';
import {sndCatalog} from "../../../mode/catalog/catalog.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {Flow, Node, WorkflowService} from "../../../service/workflow/workflow.service";
import {forEach} from "@angular/router/src/utils/collection";
declare var $:any;
declare var confirmFunc:any;
@Component({
  selector: 'app-flow-config',
  templateUrl: './flow-config.component.html',
  styleUrls: ['./flow-config.component.css'],
  providers: [WorkflowService]
})
export class FlowConfigComponent implements OnInit {

  public fatherRule:sndCatalog;
  public rule: sndCatalog;
  public pageNo: number;
  public pageSize:number;
  public total: number;
  public flows: Array<Flow>;
  public copyFlow: Flow;
  public search: Flow;
  public list: Array<Node>;
  public tempSegment: Array<Node>;
  public disableStatus: boolean;
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private workflowService:WorkflowService
  ) {
    this.fatherRule = this.globalCatalogService.getRole("system/flow");
  }

  ngOnInit() {
    this.pageNo = 1;
    this.pageSize = 10;
    this.total = 0;
    this.search = new Flow();
    this.flows = [];
    this.copyFlow = new Flow();
   // this.copyFlow.content = [];
    this.list = [];
    this.disableStatus = false;
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.fatherRule = this.globalCatalogService.getRole("system/flow");
      }
    );
    if(this.fatherRule){
      this.getRule(this.fatherRule.ID);
    }
    this.getSelectList();
    this.getFlowList(1);
  }
  getRule(id) {
    this.globalCatalogService.getCata(id, "system", "system/flow/flowConfig")
      .subscribe(data =>{
        if(this.errorResponseService.errorMsg(data)&&data.data.length>0){
          this.rule = data.data[0];
        }
      })
  }
  /*获取所有群组作为工作流配置条件*/
  getSelectList(){
    this.workflowService.getGroupSelect("")
      .subscribe(data => {
        if (this.errorResponseService.errorMsg(data)) {
          this.list = data.data.infos;
        }
      });
  }
  /*获取所有流程的列表*/
  getFlowList(pageNo){
    this.pageNo = pageNo;
    this.workflowService.getFlowList(this.search,this.pageNo,this.pageSize)
      .subscribe(data => {
        if (this.errorResponseService.errorMsg(data)) {
          this.flows = data.data.infos;
          this.total = data.data.total;
        }
      });
  }
  /*查看流程*/
  watch(flow:Flow){
    this.newFlow();
     this.copyFlow = JSON.parse(JSON.stringify(flow));
     this.tempSegment = JSON.parse(JSON.stringify(this.copyFlow.nodes));
    // this.copyFlow = flow;
    // this.copyFlow.content = this.copyFlow.content.slice(2,this.copyFlow.content.length-1);
    // this.copyFlow.content = flow.nodes;
    // this.list = flow.nodes;
    this.disableStatus = true;
  }
  /*编辑流程*/
  edit(flow:Flow){
    this.newFlow();
    this.copyFlow = JSON.parse(JSON.stringify(flow));
    this.tempSegment = JSON.parse(JSON.stringify(this.copyFlow.nodes));
    // this.copyFlow.content = this.copyFlow.content.slice(2,this.copyFlow.content.length-1);
    // this.copyFlow.content = flow.nodes;
  }

  /*新建流程*/
  newFlow(){
    this.copyFlow = new Flow();
    // this.copyFlow.content = [];
    $('#FlowSetting').show();
    this.disableStatus = false;
  }
  /*关闭流程新建弹框*/
  closeFlow(){
    // this.copyFlow.content = [];
    $('.red').removeClass('red');
    $('.error').fadeOut();
    $('#FlowSetting').hide();
  }
  delFlow(flow){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除'+flow.name+'流程?',
      'popType': 1,
      'imgType': 3,
      'callback': ()=> {
        let postData = JSON.parse(JSON.stringify(flow));
        postData.status = "delete";
        this.workflowService.updateFlowStatus(postData)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
              });
              this.getFlowList(1);
            }
          })
      }
    });
  }
  /*流程*/
  submit(){
    if(this.disableStatus){
      this.closeFlow();
    }
    else{
    let error = 0;
    /*this.verifyEmpty(this.copyFlow.name,'name');
    this.verifyEmpty(this.copyFlow.note,'note');
    for(let i = 0;i<this.copyFlow.nodes.length;i++){
      if(typeof (this.copyFlow.id)==="undefined"||this.copyFlow.id === null){
        confirmFunc.init({
          'title': '提示',
          'mes': "请补充流程环节信息！",
          'popType': 2,
          'imgType': 2,
        });
        return false;
      }
    }*/
    if($('.red').length === 0 && error === 0) {
      let postdata = JSON.parse(JSON.stringify(this.copyFlow));
      delete postdata.status;
      /*if(typeof (postdata.id) === "undefined"){
        this.workflowService.addFlow(postdata)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
              });
              this.closeFlow();
              this.getFlowList(1);
            }
          })
      }else*/{
        this.workflowService.editFlow(postdata)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
              });
              this.closeFlow();
              this.getFlowList(1);
            }
          })
      }
    }
    }
  }
  addFlows(){
    this.copyFlow.nodes.push(new Node());
  }
  delFlows(){
    this.copyFlow.nodes.pop();
  }
  changeSelect(index,j){
    // this.copyFlow.content[index] = JSON.parse(JSON.stringify(this.list[j]));
    // this.copyFlow.content[index].name = this.list[j].name;
     // this.copyFlow.nodes[index].group.name = this.list[j].name;
    // alert(this.copyFlow.nodes[index].groupId + '========='+this.list[j].id);
    this.copyFlow.nodes[index].groupId = this.list[j].id;
    // alert('修改后' +this.copyFlownodes[index].groupId + '========='+this.list[j].id);
    // alert(this.copyFlow.nodes);

  }
  addNode(i){
    if(this.copyFlow.nodes.length < 9) {
      let node = new Node();
      this.tempSegment.splice(i + 1, 0, node);
      this.copyFlow.nodes.splice(i + 1, 0, node);
    }else{
      confirmFunc.init({
        'title': '提示',
        'mes': '必须少于9个的流程节点',
        'popType': 2,
        'imgType': 2,
        'callback': ()=> {}
      });
    }
  }
  deleteNode(i){
    if(this.copyFlow.nodes.length > 1){
      this.tempSegment.splice(i,1);
      this.copyFlow.nodes.splice(i,1);
    }else{
      confirmFunc.init({
        'title': '提示',
        'mes': '必须保留一个以上的流程节点',
        'popType': 2,
        'imgType': 2,
        'callback': ()=> {}
      });
    }
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
  changeStatus(flow:Flow){
    let postData = JSON.parse(JSON.stringify(flow));
    let status;
    if(flow.status === '有效') {
      postData.status = "invalid";
      status = '无效';
    }
    else {
      postData.status = "valid";
      status = '有效';
    }
    confirmFunc.init({
      'title': '提示',
      'mes': '是否修改'+postData.name+'的状态为' + status+'?',
      'popType': 1,
      'imgType': 3,
      'callback': ()=> {
        this.workflowService.updateFlowStatus(postData)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
              });
              this.getFlowList(1);
            }
          })
      }
    });
  }
}

