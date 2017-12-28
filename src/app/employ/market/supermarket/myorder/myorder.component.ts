import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {SupermarketOrder} from "../../../../mode/supermarketOrder/supermarket-order.service";
import {SupermarketOrderItem} from "../../../../mode/supermarketOrderItem/supermarket-order-item.service";
import * as $ from 'jquery';
@Component({
  selector: 'app-myorder',
  templateUrl: './myorder.component.html',
  styleUrls: ['./myorder.component.css'],
  providers: [SupermarketManagerService,ErrorResponseService]
})
export class MyorderComponent implements OnInit {
  public search: SupermarketOrder;
  private pageNo: number = 1;
  /*当前页码*/
  private pageSize: number = 6;
  public orders:Array<SupermarketOrder>;
  public vegetableOrderItems:Array<SupermarketOrderItem>;
  public myOrder:SupermarketOrder;
  constructor(private supermarketManagerService: SupermarketManagerService,
    private errorVoid: ErrorResponseService,) { }

  ngOnInit() {
    this.getOrderList();
  }

  /**
   * 我的订单列表
   */
  getOrderList(){
    this.supermarketManagerService.getOrderList().subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        this.orders = data.data.infos;
        console.log(this.orders);

      }
    });
  }

  updateOrders(orderId,status){
    this.myOrder = new SupermarketOrder();
    this.myOrder.id = orderId;
    this.myOrder.status =  status;
    this.supermarketManagerService.updateOrder(this.myOrder) .subscribe(data => {
      console.log(data);
      if(data['status'] === 0){
        alert(data['msg']);
        this.getOrderList();
      }else{
        alert(data['msg']);
      }
    });
  }
}
