import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {IpSettingService} from "../ip-setting/ip-setting.service";

@Injectable()
export class WorkflowService {

  constructor(
    private http: Http,
    private ipSetting  : IpSettingService
  ) { }
  /*新增工作流*/
  addFlow(data) {
    const url = this.ipSetting.ip + '/workflow/flow/addFlow';
    return this.http.post(url,data,this.ipSetting.options)
      .map(res => res.json());
  }
  /*编辑工作流*/
  editFlow(data) {
    const url = this.ipSetting.ip + '/workflow/flow/modify';
    return this.http.post(url,data,this.ipSetting.options)
      .map(res => res.json());
  }
  /*获取所有群组作为工作流配置条件*/
  getGroupSelect(name) {
    const url = this.ipSetting.ip + '/workflow/group/getGroupSelect?name='+name;
  //  const url = this.ipSetting.ip + '/workflow/group/getGroupSelect?name='+name;
    return this.http.get(url,this.ipSetting.options)
      .map(res => res.json());
  }
  /*获取工作流流程列表*/
  getFlowList(search,pageNo,pageSize) {
    const url = this.ipSetting.ip + '/workflow/flow/getFlowList/'+pageNo+'/'+pageSize;
    return this.http.post(url,search,this.ipSetting.options)
      .map(res => res.json());
  }
  /*修改工作流流程状态*/
  updateFlowStatus(data) {
    const url = this.ipSetting.ip + '/workflow/flow/updateFlowStatus';
    return this.http.post(url,data,this.ipSetting.options)
      .map(res => res.json());
  }
  /*获取待审批的工作流*/
  getReviewList(search,pageNo,pageSize) {
    const url = this.ipSetting.ip + '/workflow/review/getReviewList/'+pageNo+'/'+pageSize;
    return this.http.post(url,search,this.ipSetting.options)
      .map(res => res.json());
  }
  /*获取指定的工作流*/
  getReviewInfo(id){
    const url = this.ipSetting.ip + '/workflow/review/getReviewInfo/'+id;
    return this.http.get(url,this.ipSetting.options)
      .map(res => res.json());
  }
  /*对当前工作流节点进行审批*/
  checkWorkFlow(workFlowNode,flowId,handleUserId) {
    const url = this.ipSetting.ip + '/workflow/review/checkWorkFlow/'+flowId+'?handleUserId='+handleUserId;
    return this.http.post(url,workFlowNode,this.ipSetting.options)
      .map(res => res.json());
  }
  /*获取指定群组所有用户作为下拉条件*/
  getUserSelect(id){
    const url = this.ipSetting.ip + '/workflow/group/getUserSelect/'+id;
    return this.http.get(url,this.ipSetting.options)
      .map(res => res.json());
  }
}

export class Review{
  id: number;
  name: string;
  note: string;
  status: string;
  createTime: string;
  createUserId: string;
  createUserName: string;
  type: string;
  bTime: string;
  eTime: string;
  batchId: string;
  cause: string;
  content:  Array<Segment>;
  deptId: string;
  handleHasUser: number;
  handleMinUser: number;
  handleUserId: string;
  modifyTime: string;
  modifyUserId: string;
  priority: number;
  schedule: number;
  handleUrl: string;
}

export class Flow{
  id: number;
  name: string;
 // content: Array<Segment>;
  nodes: Array<Node>;
  note: string;
  status: string;
  createTime: string;
  createUserId: string;
}

export class Segment {
  id :number;
  name:string;
  content:string;
  groupId:string;
  type:string;
  status:string;
  front:string;
  next:string;
  createTime: string;
  handleUserId: Array<string>;
  nodeReview: ReviewNote;
  nodeReviews: Array<ReviewNote>;
  userName: string;
  userId: string;
  note: string;
  result: string;
}

export class Node {
  id :number;
  name:string;
  groupId:number;
  type:string;
  nodeState:string;
  createTime: string;
  createUserId: string;
  group: Group;
}

export class ReviewNote{
  id: string;
  note: string;
  result: string;
}

export class Group{
   id: string;
   name: string;
}
