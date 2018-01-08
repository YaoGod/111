import { Component, OnInit } from '@angular/core';
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SupermarketOrder} from "../../../../mode/supermarketOrder/supermarket-order.service";
import * as $ from 'jquery';
import {WorkspaceMydeskService} from "../../../../service/workspace-mydesk/workspace-mydesk.service";
declare var confirmFunc:any;
@Component({
  selector: 'app-suporder',
  templateUrl: './supermarketOrder.component.html',
  styleUrls: ['./supermarketOrder.component.css'],
  providers: [
    SupermarketManagerService,
    SupermarketManagerService,
    WorkspaceMydeskService,
    ErrorResponseService]

})
export class SupermarketOrderComponent implements OnInit {
  public search   : SupermarketOrder;
  public pageNo   : number = 1;
  public pageSize : number = 5;
  public total    : number = 0;
  public serviceCenters: Array<any>;
  public orders:Array<SupermarketOrder>;
  public productName:string = '';
  public serverCenter:string='';
  private delId: any;
  public pages: Array<number>;
  public updateOrder={
    id:'',
    status:'',
    note:''
  };

  constructor(private supermarketManagerService: SupermarketManagerService,
              private workspaceMydeskService: WorkspaceMydeskService,
              private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.getOrderAllList(1);
    this.getServiceCenter();
  }
  /*获取订单列表*/
  getOrderAllList(pageNo){
    this.pageNo = pageNo;
    if(this.productName!=null){
      this.productName = this.productName.trim();
    }
    if(this.serverCenter!=null){
      this.serverCenter = this.serverCenter.trim();
    }
    this.supermarketManagerService.getOrderAllList(this.productName,this.serverCenter,this.pageNo,this.pageSize).subscribe(data => {
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

  update(orderId,status){
    this.updateOrder.id = orderId;
    this.updateOrder.status = status;
    if(this.updateOrder.status=="4"){
      this.updateOrders();
    }else{
      $('.mask').show();
    }
  }

  updateOrders(){
    this.supermarketManagerService.updateOrder(this.updateOrder) .subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        confirmFunc.init({
          'title': '提示',
          'mes': "修改成功",
          'popType': 0,
          'imgType': 1,
        });
        this.closeMask();
        this.getOrderAllList(1);
      }
    });

  }
  /*删除*/
  delete(id) {
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除改条数据？',
      'popType': 1,
      'imgType': 3,
      "callback": () => {
        this.supermarketManagerService.deleteOrder(id)
          .subscribe(data => {
            if (this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': '删除成功',
                'popType': 0,
                'imgType': 1
              });
              this.getOrderAllList(1);
            }
          });
      }
    });
  }

  closeMask() {
    $('.mask').hide();
  }
  noFunc() {
    $('.confirm').fadeOut();
  }

}
