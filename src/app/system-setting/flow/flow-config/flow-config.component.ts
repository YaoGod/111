import { Component, OnInit } from '@angular/core';
import {sndCatalog} from "../../../mode/catalog/catalog.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {Flow, Segment, WorkflowService} from "../../../service/workflow/workflow.service";
declare var $:any;
declare var confirmFunc:any;
@Component({
  selector: 'app-flow-config',
  templateUrl: './flow-config.component.html',
  styleUrls: ['./flow-config.component.css'],
  providers: [WorkflowService]
})
export class FlowConfigComponent implements OnInit {

  public rule: sndCatalog;
  public pageNo: number;
  public pageSize:number;
  public total: number;
  public flows: Array<Flow>;
  public copyFlow: Flow;
  public search: Flow;
  public list: Array<Segment>;
  public disableStatus: boolean;
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private workflowService:WorkflowService
  ) {
    this.rule = this.globalCatalogService.getRole("system/flow");
  }

  ngOnInit() {
    this.pageNo = 1;
    this.pageSize = 10;
    this.total = 0;
    this.search = new Flow();
    this.flows = [];
    this.copyFlow = new Flow();
    this.copyFlow.content = [];
    this.list = [];
    this.disableStatus = false;
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("system/flow");
      }
    );
    if(this.rule){
      this.getRule(this.rule.ID);
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
          this.list = data.data;
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
    this.copyFlow.content = this.copyFlow.content.slice(2,this.copyFlow.content.length-1);
    this.disableStatus = true;
  }
  /*编辑流程*/
  edit(flow:Flow){
    this.newFlow();
    this.copyFlow = JSON.parse(JSON.stringify(flow));
    this.copyFlow.content = this.copyFlow.content.slice(2,this.copyFlow.content.length-1);
  }
  /*新建流程*/
  newFlow(){
    this.copyFlow = new Flow();
    this.copyFlow.content = [];
    $('#FlowSetting').show();
    this.disableStatus = false;
  }
  /*关闭流程新建弹框*/
  closeFlow(){
    this.copyFlow.content = [];
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
    this.verifyEmpty(this.copyFlow.name,'name');
    this.verifyEmpty(this.copyFlow.note,'note');
    for(let i = 0;i<this.copyFlow.content.length;i++){
      if(typeof (this.copyFlow.id)==="undefined"||this.copyFlow.id === null){
        confirmFunc.init({
          'title': '提示',
          'mes': "请补充流程环节信息！",
          'popType': 2,
          'imgType': 2,
        });
        return false;
      }
    }
    if($('.red').length === 0 && error === 0) {
      let postdata = JSON.parse(JSON.stringify(this.copyFlow));
      if(typeof (postdata.id) === "undefined"){
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
      }else{
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
    this.copyFlow.content.push(new Segment());
  }
  delFlows(){
    this.copyFlow.content.pop();
  }
  changeSelect(index,j){
    this.copyFlow.content[index] = JSON.parse(JSON.stringify(this.list[j]));
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

