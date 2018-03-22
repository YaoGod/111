import { Component, OnInit } from '@angular/core';
import { VegetableOrder} from '../../../../mode/vegetableOrder/vegetable-order.service';
import { VegetableOrderItem} from '../../../../mode/vegetableOrderItem/vegetable-order-item.service'
import { VegetableInfoService } from '../../../../service/vegetable-info/vegetable-info.service';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import { IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {ActivatedRoute, Params} from "@angular/router";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import * as $ from 'jquery';
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
  public chooseId:string;
  constructor(private vegetableInfoService:VegetableInfoService,
              private errorVoid: ErrorResponseService,
              private route: ActivatedRoute,
              public ipSetting  : IpSettingService
  ) { }

  ngOnInit() {
    if(typeof (this.route.params['_value']['id']) === "undefined"){
      this.getOrderList(1,"");
    }else{
      let tempid: number = 0;
      this.route.params
        .switchMap((params: Params) => this.chooseId = params['id'])
        .subscribe(() => {
          if (tempid === 0) {
            this.getOrderList(1,this.chooseId);
            tempid++;
          }
        });
    }
  }
  /** 我的订单*/
  getOrderList(i,id) {
    this.pageNo = i;
    let url = '/mmall/vegetabelOrder/getOrderList/'+this.pageNo+'/'+this.pageSize;
    if(id !== ""){
      url += "?id="+id;
    }
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
        this.getOrderList(1,'');
      }
    });
  }
}
