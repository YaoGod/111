import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import * as $ from 'jquery';
import {GoodsOrder, GoodsOrderItem} from "../goodsorder/goodsorder.component";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";

@Component({
  selector: 'app-goodsordermanage',
  templateUrl: './goodsordermanage.component.html',
  styleUrls: ['./goodsordermanage.component.css'],
  providers: [ErrorResponseService]
})
export class GoodsordermanageComponent implements OnInit {
  public imgPrefix: string;
  public search: GoodsOrder;
  private pageNo = 1;
  /*当前页码*/
  private pageSize = 5;
  public orders:Array<GoodsOrder>;
  public productName = '';
  public orderId = '';
  public vegetableId = '';
  public deptId:string;
  private delId: any;
  public pages: Array<number>;
  public updateOrder={
    id:'',
    status:'',
    note:''
  }
  public orderItems:Array<GoodsOrderItem>;
  constructor(private ipSetting: IpSettingService,
              private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.imgPrefix = this.ipSetting.ip;
    this.pages = [];
    this.getOrderAllList();
  }

  /*获取订单列表*/
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
    let url = '/mmall/vegetabelOrder/getOrderAllList/'+this.pageNo+'/'+this.pageSize+"?productName="
      +this.productName+"&orderId="+this.orderId+"&productId="+this.vegetableId;
    this.ipSetting.sendPost(url,null)
      .subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        this.orders = data.data.infos;

        let total = Math.ceil(data.data.total / this.pageSize);
        this.initPage(total);
      }
    });
  }

  update(orderId,status){
    this.updateOrder.id = orderId;
    this.updateOrder.status = status;
    if(this.updateOrder.status === "4"){
      this.updateOrders();
    }else{
      $('.mask').show();
    }
  }

  /*更新订单*/
  updateOrders(){
    let url = '/mmall/vegetabelOrder/iVegetableOrder/';
    this.ipSetting.sendPost(url,this.updateOrder)
      .subscribe(data => {

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
    let url = '/mmall/vegetabelOrder/deleteVegetableOrder/'+this.delId;
    this.ipSetting.sendPost(url,null)
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
