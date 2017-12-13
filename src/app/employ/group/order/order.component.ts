import { Component, OnInit } from '@angular/core';
import { GroupProductService } from '../../../service/group-product/group-product.service';
import * as $ from 'jquery';
import { GroupOrderService } from '../../../service/group-order/group-order.service';
import {GroupOrder} from '../../../mode/groupOrder/group-order.service';
import {GroupOrderItem} from '../../../mode/groupOrderItem/group-orderItem.service'
import { GroupOrderItemService } from '../../../service/group-orderItem/group-order-item.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import {forEach} from "@angular/router/src/utils/collection";
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  providers:[GroupOrderService,GroupOrderItemService,ErrorResponseService]
})
export class OrderComponent implements OnInit {

  public search: GroupOrder;
  private pageNo: number = 1;
  /*当前页码*/
  private pageSize: number = 5;
  public orders:Array<GroupOrder>;
  public productName:string = '';
  public orderId:string = '';
  public productId:string = '';
  public deptId:string;
  private delId: any;
  public updateOrder={
    id:'',
    status:'',
    note:''
  }

  public orderItems:Array<GroupOrderItem>;

  constructor(private groupOrderService: GroupOrderService,private groupOrderItemService:GroupOrderItemService,
              private errorVoid: ErrorResponseService,) { }

  ngOnInit() {
    this.getOrderAllList();
  }

  getOrderAllList(){
    if(this.productName!=null){
      this.productName = this.productName.trim();
    }
    if(this.orderId!=null){
      this.orderId = this.orderId.trim();
    }
    if(this.productId!=null){
      this.productId = this.productId.trim();
    }
    this.groupOrderService.getOrderAllList(this.productName,this.orderId,this.productId,this.pageNo,this.pageSize).subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        this.orders = data.data.infos;
        console.log(this.orders);

      }
    });
  }

  update(orderId,status){
    this.updateOrder.id = orderId;
    this.updateOrder.status = status;
    $('.mask').show();
  }

  updateOrders(){
    this.groupOrderService.updateOrder(this.updateOrder) .subscribe(data => {
      console.log(data);
      if(data['status'] === 0){
        alert("修改成功")
        this.closeMask();
        this.getOrderAllList();
      }else{
        alert("修改失败")
        this.closeMask();
      }
    });

  }

  delete(orderid:number){
    this.delId = orderid;
    $('.confirm').fadeIn();
  }

  /*删除*/
  okFunc() {
    $('.confirm').hide();
    this.groupOrderService.deleteOrder( this.delId)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data.status)) {
          alert("删除成功");
        }
        this.getOrderAllList();
      });
  }

  closeMask() {
    $('.mask').hide();
  }
  noFunc() {
    $('.confirm').fadeOut();
  }
}
