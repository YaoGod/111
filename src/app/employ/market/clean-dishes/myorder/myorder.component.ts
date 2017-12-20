import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {VegetableOrder} from '../../../../mode/vegetableOrder/vegetable-order.service';
import {VegetableOrderItem} from '../../../../mode/vegetableOrderItem/vegetable-order-item.service'
import { VegetableInfoService } from '../../../../service/vegetable-info/vegetable-info.service';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import {forEach} from "@angular/router/src/utils/collection";
@Component({
  selector: 'app-myorder',
  templateUrl: './myorder.component.html',
  styleUrls: ['./myorder.component.css'],
  providers: [VegetableInfoService,ErrorResponseService]
})
export class MyorderComponent implements OnInit {

  public search: VegetableOrder;
  private pageNo: number = 1;
  /*当前页码*/
  private pageSize: number = 6;
  public orders:Array<VegetableOrder>;
  public vegetableOrderItems:Array<VegetableOrderItem>;
  public myOrder:VegetableOrder;

  constructor(private vegetableInfoService:VegetableInfoService,
              private errorVoid: ErrorResponseService,) { }

  ngOnInit() {
    this.getOrderList();
  }

  /**
   * 我的订单列表
   */
  getOrderList(){
    this.vegetableInfoService.getOrderList().subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        this.orders = data.data.infos;
        console.log(this.orders);

      }
    });
  }

  updateOrders(orderId,status){
    this.myOrder = new VegetableOrder();
    this.myOrder.id = orderId;
    this.myOrder.status =  status;
    this.vegetableInfoService.updateOrder(this.myOrder) .subscribe(data => {
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
