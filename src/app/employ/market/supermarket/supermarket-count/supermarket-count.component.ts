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
  public search : any = {};
  public serviceCenters: Array <any> = [];
  constructor(
    private supermarketManagerService: SupermarketManagerService,
    private errorVoid: ErrorResponseService,
    private workspaceMydeskService: WorkspaceMydeskService,
  ) { }

  ngOnInit() {
    this.search.status = "";
    this.search.serviceCenter = "";
    this. getServiceCenter();
    this.getOrderAllList(1);
  }
  /*获取订单列表*/
  getOrderAllList(pageNo){
    this.pageNo = pageNo;
    this.supermarketManagerService.getOrderAllList(this.search,this.pageNo,this.pageSize)
      .subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
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

      }
    });
  }

}
