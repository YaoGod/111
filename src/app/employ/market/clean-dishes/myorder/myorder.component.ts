import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {VegetableOrder} from '../../../../mode/vegetableOrder/vegetable-order.service';
import {VegetableOrderItem} from '../../../../mode/vegetableOrderItem/vegetable-order-item.service'
import { VegetableInfoService } from '../../../../service/vegetable-info/vegetable-info.service';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import {forEach} from "@angular/router/src/utils/collection";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
declare var confirmFunc:any;
@Component({
  selector: 'app-myorder',
  templateUrl: './myorder.component.html',
  styleUrls: ['./myorder.component.css'],
  providers: [VegetableInfoService,ErrorResponseService]
})
export class MyorderComponent implements OnInit {

  public search: VegetableOrder;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public orders:Array<VegetableOrder>;
  public vegetableOrderItems:Array<VegetableOrderItem>;
  public myOrder:VegetableOrder;

  constructor(private vegetableInfoService:VegetableInfoService,
              private errorVoid: ErrorResponseService,
              private ipSetting  : IpSettingService
  ) { }

  ngOnInit() {
    this.getOrderList(1);
  }

  /** 我的订单*/
  getOrderList(i) {
    this.pageNo = i;
    let url = '/mmall/vegetabelOrder/getOrderList/'+this.pageNo+'/'+this.pageSize;
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.orders = data.data.infos;
        this.total = data.data.total;
      }
    });
  }

  updateOrders(orderId,status){
    this.myOrder = new VegetableOrder();
    this.myOrder.id = orderId;
    this.myOrder.status =  status;
    this.vegetableInfoService.updateOrder(this.myOrder) .subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示' ,
          'mes': data['msg'],
          'popType': 0 ,
          'imgType': 1 ,
        });
        this.getOrderList(1);
      }
    });
  }
}
