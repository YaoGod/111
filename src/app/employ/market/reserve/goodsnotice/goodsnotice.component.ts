import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import * as $ from 'jquery';
import {GoodsOrder, GoodsOrderItem} from "../goodsorder/goodsorder.component";

declare var confirmFunc: any;
declare var tinymce: any;
@Component({
  selector: 'app-goodsnotice',
  templateUrl: './goodsnotice.component.html',
  styleUrls: ['./goodsnotice.component.css'],
  providers: [ErrorResponseService]
})
export class GoodsnoticeComponent implements OnInit {
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
  constructor(private ipSetting  : IpSettingService,private errorVoid: ErrorResponseService) { }

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

    let url = '/goodsOrder/search?' + 'serviceCenter=' + this.vegetableId +'&orderNo='
        + this.orderId + '&status=' + this.productName
      + '&pageNum='+ this.pageNo + '&pageSize=' +this.pageSize;
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

