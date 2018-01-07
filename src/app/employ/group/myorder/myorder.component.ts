import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { GroupOrderService } from '../../../service/group-order/group-order.service';
import {GroupMessage, GroupOrder} from '../../../mode/groupOrder/group-order.service';
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
  public message:GroupMessage;
  private pageNo = 1;
  /*当前页码*/
  private pageSize= 6;
  public cartsize:number;
  public orders:Array<GroupOrder>;
  public orderItems:Array<GroupOrderItem>;
  public  newMessage={
    orderNo:'',
    content:''
  };
  public viewMessage={
    orderNo:'',
    content:'',
    reply:'',
    replyTime:'',
    replyUser:'',
    insterTime:''
  };
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
        console.log(this.orders);
      }
    });
  }
  getProductShowList(){
    this.groupProductService.getProductShowList(this.pageNo,this.pageSize,this.search).subscribe(data => {
      console.log();
      if (this.errorVoid.errorMsg(data)) {
        this.cartsize = data.data.cartsize;
      }
    });
  }
  private verifyEmpty(id,label) {
    if (!this.isEmpty(id, label)) {
      return false;
    }else{
      return true;
    }
  }

  /**非空校验*/
  private isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if (data==null||data===''||data.trim() === '')  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /**
   * 添加错误信息class
   * @param id
   * @param error
   */
  private  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-control').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('span').html('输入错误');
    }else {
      $('#' + id).next('span').html(error);
    }
  }
  /**
   * 去除错误信息class
   * @param id
   */
  private  removeErrorClass(id: string) {
    $('#' + id).parents('.form-control').removeClass('form-error');
    $('#' + id).parents('.form-control').children('.form-inp').children('.errorMessage').html('');
    $('#' + id).next('span').html('');
  }


  submitMessage() {
    if (!this.verifyEmpty('content','评价意见不能为空')){
      return false;
    }

    this.groupOrderService.addMessage(this.newMessage)
      .subscribe(data => {
        if(data['status'] === 0){
          alert("保存成功");
          this.closeMask0();
          this.getOrderList();
        }else{
          alert("保存失败")
          this.closeMask0();
        }
      })
  }

  closeMask0() {
    $('.mask0').hide();
    this.newMessage={
      orderNo:'',
      content:''
    };
  }
  closeMask1() {
    $('.mask1').hide();
    this.viewMessage={
      orderNo:'',
      content:'',
      reply:'',
      replyTime:'',
      replyUser:'',
      insterTime:''
    }
  }


  addMessage(orderId){
    this.newMessage.orderNo =orderId;
    $('.mask0').show();
  }
  showMessage(orderId){
    $('.mask1').show();
    this.groupOrderService.getMessage(orderId)
      .subscribe(data => {
        if(data['status'] === 0){
          console.log(data);
        this.viewMessage = data.data;
          console.log(this.viewMessage);
        }else{
          alert("获取评价信息失败");
        }
      })
  }
}

