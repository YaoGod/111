import { Component, OnInit } from '@angular/core';
declare var confirmFunc:any;
import * as $ from 'jquery';
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
@Component({
  selector: 'app-supermarket-count',
  templateUrl: './supermarket-count.component.html',
  styleUrls: ['./supermarket-count.component.css'],
  providers: [SupermarketManagerService]
})
export class SupermarketCountComponent implements OnInit {

  public pageNo = 1;
  public pageSize = 10;
  public total = 0;
  public orders = [];
  constructor(
    private supermarketManagerService: SupermarketManagerService,
    private errorVoid: ErrorResponseService
  ) { }

  ngOnInit() {
  }
  /*获取订单列表*/
  getOrderAllList(pageNo){
    this.pageNo = pageNo;
    this.supermarketManagerService.getOrderAllList('','',this.pageNo,this.pageSize)
      .subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        this.orders = data.data.infos;
        this.total = data.data.total;
      }
    });
  }
  export(){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否导出数据',
      'popType': 1,
      'imgType': 3,
      'callback': ()=>{

      }
    });
  }

}
