import { Component, OnInit } from '@angular/core';
import { GroupProductService } from '../../../service/group-product/group-product.service';
import * as $ from 'jquery';
import { GroupOrderService } from '../../../service/group-order/group-order.service';
import {GroupMessage, GroupOrder} from '../../../mode/groupOrder/group-order.service';
import {GroupOrderItem} from '../../../mode/groupOrderItem/group-orderItem.service'
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";

declare var $:any;
declare var confirmFunc: any;
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  providers:[GroupOrderService,ErrorResponseService]
})
export class OrderComponent implements OnInit {
  public catas;
  public rule;
  public search: GroupOrder;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public orders:Array<GroupOrder>;
  public productName= '';
  public orderId = '';
  public productId = '';
  public deptId:string;
  private delId: any;
  public updateOrder={
    id:'',
    status:'',
    note:''
  };
  public  newMessage={
    orderNo:'',
    content:'',
    reply:'',
    replyTime:'',
    replyUser:'',
    insterTime:''
  };
  public viewMessage={
    orderNo:'',
    content:'',
    reply:'',
    replyTime:'',
    replyUser:'',
    insterTime:''
  };
  public orderItems:Array<GroupOrderItem>;

  constructor(private groupOrderService: GroupOrderService,
              private globalCatalogService: GlobalCatalogService,
              private errorVoid: ErrorResponseService,) { }

  ngOnInit() {
    this.getRule();
    this.pages = [];
    this.getOrderAllList(1);
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'group','employ/group')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.catas = data.data;
          for(let i = 0;i<this.catas.length;i++){
            if(this.catas[i].routeUrl === "employ/group"){
              this.catas.splice(i,1);
              i = 0;
            }
            if(this.catas[i].routeUrl === "employ/group/order"){
              this.rule = this.catas[i];
            }
          }
        }
      })
  }
  getOrderAllList(pageNo){
    this.pageNo = pageNo;
    if(this.productName!=null){
      this.productName = this.productName.trim();
    }
    if(this.orderId!=null){
      this.orderId = this.orderId.trim();
    }
    if(this.productId!=null){
      this.productId = this.productId.trim();
    }
    this.groupOrderService.getOrderAllList(this.productName,this.orderId,this.productId,this.pageNo,this.pageSize)
      .subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.orders = data.data.infos;
        this.total = data.data.total;
       }
    });
  }

  update(orderId,status){
    this.updateOrder.id = orderId;
    this.updateOrder.status = status;
    $('.mask').show();
  }

  updateOrders(){
    if(!this.verifyEmpty('form-status','不能为空') || !this.verifyEmpty('form-text','不能为空')){
      return false;
    }
    this.groupOrderService.updateOrder(this.updateOrder)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示',
            'mes': data['msg'],
            'popType': 0,
            'imgType': 1,
          });
          this.closeMask();
          this.getOrderAllList(1);
        }else{
          confirmFunc.init({
            'title': '提示',
            'mes': '修改失败',
            'popType': 0,
            'imgType': 2,
          });
          this.closeMask();
          this.getOrderAllList(1);
        }
      });
  }

  delete(orderid:number){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除？',
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        this.groupOrderService.deleteOrder(orderid)
          .subscribe(data => {
            if (this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data['msg'],
                'popType': 0,
                'imgType': 1,
              });
            }
            this.getOrderAllList(1);
          });
      }
    });
  }
  closeMask0() {
    $('.errorMessage').html('');
    $('.mask0').hide();
    this.newMessage={
      orderNo:'',
      content:'',
      reply:'',
      replyTime:'',
      replyUser:'',
      insterTime:''
    };
  }
  closeMask() {
    $('.errorMessage').html('');
    $('.mask').hide();
  }
  public verifyEmpty(id,label) {
  if (!this.isEmpty(id, label)) {
    return false;
  }else{
    return true;
  }
}
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    this.getOrderAllList(this.pageNo);
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
  submitMessage() {
    if (!this.verifyEmpty('content','反馈意见不能为空')){
      return false;
    }

    this.groupOrderService.replayMessage(this.newMessage)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示',
            'mes': data['msg'],
            'popType': 0,
            'imgType': 1,
          });
          this.closeMask0();
          this.getOrderAllList(1);
        }
      })
  }
  addMessage(orderId){
    this.newMessage.orderNo =orderId;
    this.groupOrderService.getMessage(orderId)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.newMessage = data.data;
          $('.mask0').show();
        }
      });
  }
  showMessage(orderId){
    $('.mask1').show();
    this.groupOrderService.getMessage(orderId)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.viewMessage = data.data;
        }
      })
  }
}
