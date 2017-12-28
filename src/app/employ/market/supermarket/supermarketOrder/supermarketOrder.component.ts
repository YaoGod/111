import { Component, OnInit } from '@angular/core';
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SupermarketOrder} from "../../../../mode/supermarketOrder/supermarket-order.service";
import * as $ from 'jquery';
@Component({
  selector: 'app-suporder',
  templateUrl: './supermarketOrder.component.html',
  styleUrls: ['./supermarketOrder.component.css'],
  providers: [SupermarketManagerService,SupermarketManagerService,ErrorResponseService]

})
export class SupermarketOrderComponent implements OnInit {
  public search: SupermarketOrder;
  private pageNo: number = 1;
  /*当前页码*/
  private pageSize: number = 5;
  public orders:Array<SupermarketOrder>;
  public productName:string = '';
  public serverCenter:string='';
  private delId: any;
  public pages: Array<number>;
  public updateOrder={
    id:'',
    status:'',
    note:''
  }

  constructor(private supermarketManagerService: SupermarketManagerService,
              private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.pages = [];
    this.getOrderAllList();

  }
  getOrderAllList(){
    if(this.productName!=null){
      this.productName = this.productName.trim();
    }
    if(this.serverCenter!=null){
      this.serverCenter = this.serverCenter.trim();
    }
    this.supermarketManagerService.getOrderAllList(this.productName,this.serverCenter,this.pageNo,this.pageSize).subscribe(data => {
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
    this.supermarketManagerService.updateOrder(this.updateOrder) .subscribe(data => {
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
    this.supermarketManagerService.deleteOrder( this.delId)
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
