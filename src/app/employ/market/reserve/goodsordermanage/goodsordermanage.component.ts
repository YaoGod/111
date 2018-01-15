import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import * as $ from 'jquery';
import {GoodsOrder, GoodsOrderItem} from "../goodsorder/goodsorder.component";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-goodsordermanage',
  templateUrl: './goodsordermanage.component.html',
  styleUrls: ['./goodsordermanage.component.css'],
  providers: [ErrorResponseService]
})
export class GoodsordermanageComponent implements OnInit {
  public rule;
  public catas;
  public imgPrefix: string;
  public search: GoodsOrder;
  private pageNo = 1;
  /*当前页码*/
  private pageSize = 6;
  public orders:Array<GoodsOrder>;
  public productName = '';
  public orderId = '';
  public vegetableId = '';
  public deptId:string;
  private delId: any;
  public pages: Array<number>;
  public updateOrder={
    orderNo:'',
    status:0,
    note:''
  }
  public orderItems:Array<GoodsOrderItem>;
  constructor(private ipSetting: IpSettingService,
              private errorVoid: ErrorResponseService,
              private globalCatalogService: GlobalCatalogService) { }

  ngOnInit() {
    this.getRule();
    this.imgPrefix = this.ipSetting.ip;
    this.pages = [];
    this.getOrderAllList();
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'market','employ/market/reserve')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.catas = data.data;
          for(let i = 0;i<this.catas.length;i++){
            if(this.catas[i].routeUrl === "employ/market/reserve/goodsordermanage"){
              this.rule = this.catas[i];
            }
          }
        }
      })
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

    let url = '/goodsOrder/list?'
      + 'pageNum='+ this.pageNo + '&pageSize=' +this.pageSize;
    this.ipSetting.sendGet(url)
      .subscribe(data =>
      {
        if (this.errorVoid.errorMsg(data.status)) {
          this.orders = data.data.list;
          let total = Math.ceil(data.data.total / this.pageSize);
          this.initPage(total);

        }
      });
  }

  update(orderId,status){
    this.updateOrder.orderNo = orderId;
    this.updateOrder.status = status;
    if(this.updateOrder.status === 40){
      this.updateOrders();
    }else{
      $('.mask').show();
    }
  }

  /*更新订单*/
  updateOrders(){
    let url = '/goodsOrder/updateOrderStatus?userId=' + localStorage.getItem("username")
    +'&orderNo=' + this.updateOrder.orderNo +'&status=' + this.updateOrder.status;
    this.ipSetting.sendGet(url)
      .subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
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
