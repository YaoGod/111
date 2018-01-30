import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {SupermarketOrder} from "../../../../mode/supermarketOrder/supermarket-order.service";
import {SupermarketOrderItem} from "../../../../mode/supermarketOrderItem/supermarket-order-item.service";
import * as $ from 'jquery';
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
declare var confirmFunc:any;
@Component({
  selector: 'app-myorder',
  templateUrl: './myorder.component.html',
  styleUrls: ['./myorder.component.css'],
  providers: [SupermarketManagerService,ErrorResponseService]
})
export class MyorderComponent implements OnInit {
  public search   : string = "";
  public pageNo   : number = 1;
  public pageSize : number = 5;
  public total    : number = 0;
  public orders   : Array<SupermarketOrder>;
  public myOrder  : SupermarketOrder;
  constructor(
    private supermarketManagerService: SupermarketManagerService,
    private errorVoid: ErrorResponseService,
    public ipSetting  : IpSettingService
  ) { }

  ngOnInit() {
    this.orders = [];
    this.getOrderList(1);
  }
  /**
   * 我的订单列表
   */
  getOrderList(pageNo){
    this.pageNo = pageNo;
    this.supermarketManagerService.getOrderList(this.pageNo,this.pageSize,this.search)
      .subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.orders = data.data.infos;
        this.total = data.data.total;
      }
    });
  }

  updateOrders(orderId,status){
    this.myOrder = new SupermarketOrder();
    this.myOrder.id = orderId;
    this.myOrder.status =  status;
    this.supermarketManagerService.updateOrder(this.myOrder)
      .subscribe(data => {

      if(this.errorVoid.errorMsg(data)){
        confirmFunc.init({
          'title': '提示',
          'mes': data.msg,
          'popType': 0,
          'imgType': 1,
        });
        this.getOrderList(1);
      }
    });
  }
}
