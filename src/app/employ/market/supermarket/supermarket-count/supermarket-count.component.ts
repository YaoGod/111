import { Component, OnInit } from '@angular/core';
declare var confirmFunc:any;
import * as $ from 'jquery';
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {WorkspaceMydeskService} from "../../../../service/workspace-mydesk/workspace-mydesk.service";
@Component({
  selector: 'app-supermarket-count',
  templateUrl: './supermarket-count.component.html',
  styleUrls: ['./supermarket-count.component.css'],
  providers: [SupermarketManagerService,WorkspaceMydeskService]
})
export class SupermarketCountComponent implements OnInit {

  public pageNo = 1;
  public pageSize = 10;
  public total = 0;
  public orders = [];
  public search;
  public serviceCenters: Array <any> = [];
  public all :boolean;
  public checks : Array<any>;
  constructor(
    private supermarketManagerService: SupermarketManagerService,
    private errorVoid: ErrorResponseService,
    private workspaceMydeskService: WorkspaceMydeskService,
  ) { }

  ngOnInit() {
    this.search = {};
    this.search.status = "";
    this.search.serviceCenter = "";
    this.checks = [];
    this. getServiceCenter();
    this.getOrderAllList(1);
  }
  /*获取订单列表*/
  getOrderAllList(pageNo){
    this.pageNo = pageNo;
    this.supermarketManagerService.getOrderAllList('list',[],this.search,this.pageNo,this.pageSize)
      .subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.orders = data.data.infos;
        this.total = data.data.total;
      }
    });
  }
  /*获取服务中心列表*/
  getServiceCenter(){
    this.workspaceMydeskService.getServiceCenter()
      .subscribe((data)=>{
        if(this.errorVoid.errorMsg(data)){
          this.serviceCenters = data.data;
        }
      });
  }
  /*导出*/
  export(){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否导出数据',
      'popType': 1,
      'imgType': 3,
      'callback': ()=>{
        let list = document.getElementsByName("orderCheck");
        this.checks = [];
        for(let i = 0;i<list.length;i++){
          if(list[i]['checked']){
            this.checks.push(list[i]['value']);
          }
        }
        if(this.checks.length>0){
          this.supermarketManagerService.getOrderAllList('excel',this.checks,this.search,this.pageNo,this.pageSize)
        }else{
          this.supermarketManagerService.getOrderAllList('excel',['all'],this.search,this.pageNo,this.pageSize)
        }
      }
    });
  }
  /*全选*/
  checkedAll(){
    let list = document.getElementsByName("orderCheck");
    for(let i = 0;i<list.length;i++){
      list[i]['checked'] = this.all;
    }
  }
  /*判断是否全选*/
  checkIsAll(){
    let list = document.getElementsByName("orderCheck");
    for(let i = 0;i<list.length;i++){
      if(!list[i]['checked']){
        this.all = false;
      }
    }
  }
}
