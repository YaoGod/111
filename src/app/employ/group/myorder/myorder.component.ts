import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { GroupOrderService } from '../../../service/group-order/group-order.service';
import {GroupOrder} from '../../../mode/groupOrder/group-order.service';
import {GroupOrderItem} from '../../../mode/groupOrderItem/group-orderItem.service'
import { GroupOrderItemService } from '../../../service/group-orderItem/group-order-item.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import {forEach} from "@angular/router/src/utils/collection";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {GroupProductService} from "../../../service/group-product/group-product.service";
import {GroupNoticeService} from "../../../service/group-notice/group-notice.service";

@Component({
  selector: 'app-order',
  templateUrl: './myorder.component.html',
  styleUrls: ['./myorder.component.css'],
  providers:[GroupOrderService,GroupOrderItemService,ErrorResponseService,GroupProductService,GroupNoticeService]
})
export class MyorderComponent implements OnInit {
  public search: GroupOrder;
  private pageNo: number = 1;
  /*当前页码*/
  private pageSize: number = 6;
  public cartsize:number;
  public orders:Array<GroupOrder>;
  public orderItems:Array<GroupOrderItem>;

  constructor(private groupOrderService: GroupOrderService,
              private groupOrderItemService:GroupOrderItemService,
              private globalCatalogService: GlobalCatalogService,
              private groupProductService: GroupProductService,
              private groupNoticeService: GroupNoticeService,
              private errorVoid: ErrorResponseService,) { }

  ngOnInit() {
   this.getOrderList();
    this.getProductShowList();
  }

  getOrderList(){
    this.search = new GroupOrder();
    this.groupOrderService.getOrderList().subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.orders = data.data.infos;

      }
    });
  }
  getProductShowList(){
    this.groupProductService.getProductShowList(this.pageNo,this.pageSize,this.search).subscribe(data => {

      if (this.errorVoid.errorMsg(data)) {
        this.cartsize = data.data.cartsize;
      }
    });
  }

}
