import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {SupermarketOrder} from "../../../../mode/supermarketOrder/supermarket-order.service";
import * as $ from 'jquery';
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {ActivatedRoute,Params} from "@angular/router";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
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
  public chooseId;
  constructor(
    private route: ActivatedRoute,
    private supermarketManagerService: SupermarketManagerService,
    private errorVoid: ErrorResponseService,
    public ipSetting  : IpSettingService
  ) { }

  ngOnInit() {
    this.orders = [];
    if(typeof (this.route.params['_value']['id']) === "undefined"){
      this.chooseId = "";
      this.getOrderList(1,this.chooseId);
    }else{
      let tempid: number = 0;
      this.route.params
        .switchMap((params: Params) => this.chooseId = params['id'])
        .subscribe(() => {
          if (tempid === 0) {
            this.getOrderList(1,this.chooseId);
            tempid++;
          }
        });
    }
  }
  /**
   * 我的订单列表
   */
  getOrderList(pageNo,chooseId){
    this.pageNo = pageNo;
    this.supermarketManagerService.getOrderList(this.pageNo,this.pageSize,this.search,chooseId)
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
        this.getOrderList(1,this.chooseId);
      }
    });
  }
}
