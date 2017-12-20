import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {VegetableOrder} from '../../../../mode/vegetableOrder/vegetable-order.service';
import {VegetableOrderItem} from '../../../../mode/vegetableOrderItem/vegetable-order-item.service'
import { VegetableInfoService } from '../../../../service/vegetable-info/vegetable-info.service';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import {forEach} from "@angular/router/src/utils/collection";


@Component({
  selector: 'app-vegorder',
  templateUrl: './vegorder.component.html',
  styleUrls: ['./vegorder.component.css'],
  providers: [VegetableInfoService,ErrorResponseService]

})
export class VegorderComponent implements OnInit {

  public search: VegetableOrder;
  private pageNo: number = 1;
  /*当前页码*/
  private pageSize: number = 5;
  public orders:Array<VegetableOrder>;
  public productName:string = '';
  public orderId:string = '';
  public vegetableId:string = '';
  public deptId:string;
  private delId: any;
  public pages: Array<number>;
  public updateOrder={
    id:'',
    status:'',
    note:''
  }

  public orderItems:Array<VegetableOrderItem>;
  constructor(private vegetableInfoService: VegetableInfoService,
              private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.pages = [];
    this.getOrderAllList();

  }
  getOrderAllList(){
    if(this.productName!=null){
      this.productName = this.productName.trim();
    }
    if(this.orderId!=null){
      this.orderId = this.orderId.trim();
    }
    if(this.vegetableId!=null){
      this.vegetableId = this.vegetableId.trim();
    }
    this.vegetableInfoService.getOrderAllList(this.productName,this.orderId,this.vegetableId,this.pageNo,this.pageSize).subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        this.orders = data.data.infos;
        console.log(this.orders);
        let total = Math.ceil(data.data.total / this.pageSize);
        this.initPage(total);
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
    this.vegetableInfoService.updateOrder(this.updateOrder) .subscribe(data => {
      console.log(data);
      if(data['status'] === 0){
        alert(data['msg']);
        this.closeMask();
        this.getOrderAllList();
      }else{
        alert(data['msg']);
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
    this.vegetableInfoService.deleteOrder( this.delId)
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

  /*页码初始化*/
  initPage(total){
    this.pages = new Array(total);
    console.log(this.pages);
    for(let i = 0;i< total ;i++){
      this.pages[i] = i+1;
    }
  }
  /*页面显示区间5页*/
  pageLimit(page:number){
    if(this.pages.length < 5){
      return false;
    } else if(page<=5 && this.pageNo <= 3){
      return false;
    } else if(page>=this.pages.length -4 && this.pageNo>=this.pages.length-2){
      return false;
    } else if (page<=this.pageNo+2 && page>=this.pageNo-2){
      return false;
    }
    return true;
  }
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    this.getOrderAllList();
  }
}
