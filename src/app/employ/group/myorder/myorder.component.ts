import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { GroupOrderService } from '../../../service/group-order/group-order.service';
import {GroupOrder} from '../../../mode/groupOrder/group-order.service';
import {GroupOrderItem} from '../../../mode/groupOrderItem/group-orderItem.service'
import { GroupOrderItemService } from '../../../service/group-orderItem/group-order-item.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-order',
  templateUrl: './myorder.component.html',
  styleUrls: ['./myorder.component.css'],
  providers:[GroupOrderService,GroupOrderItemService,ErrorResponseService]
})
export class MyorderComponent implements OnInit {
  public search: GroupOrder;
  private pageNo: number = 1;
  /*当前页码*/
  private pageSize: number = 6;
  public orders:Array<GroupOrder>;
  public orderItems:Array<GroupOrderItem>;

  constructor(private groupOrderService: GroupOrderService,private groupOrderItemService:GroupOrderItemService,
              private errorVoid: ErrorResponseService,) { }

  ngOnInit() {
   this.getOrderList();
  }

  getOrderList(){
    this.groupOrderService.getOrderList().subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        this.orders = data.data.infos;
        console.log(this.orders);

      }
    });
  }

}
