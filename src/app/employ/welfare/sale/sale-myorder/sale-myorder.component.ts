import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {SaleProductEmployeeService} from "../../../../service/sale-product-employee/sale-product-employee.service";
import {ActivatedRoute, Params} from "@angular/router";
import {OrderSale, SaleProduct} from "../../../../mode/saleProduct/sale-product.service";
@Component({
  selector: 'app-sale-myorder',
  templateUrl: './sale-myorder.component.html',
  styleUrls: ['./sale-myorder.component.css']
})
export class SaleMyorderComponent implements OnInit {

  public search   : SaleProduct;
  public pageNo   : number = 1;
  public pageSize : number = 5;
  public total    : number = 0;
  public orders   : Array<OrderSale>;
  public formData : any;
  constructor(
    private route: ActivatedRoute,
    private saleProductEmployeeService:SaleProductEmployeeService,
    private errorVoid: ErrorResponseService,
    public ipSetting  : IpSettingService
  ) { }

  ngOnInit() {
    this.orders = [];
    this.search = new SaleProduct();
    if(typeof (this.route.params['_value']['id']) === "undefined"){
      delete this.search.id;
      this.getOrderList(1);
    }else{
      let tempid: number = 0;
      this.route.params
        .switchMap((params: Params) => this.search.id  = params['id'])
        .subscribe(() => {
          if (tempid === 0) {
            this.getOrderList(1);
            tempid++;
          }
        });
    }
  }

  getOrderList(pageNo){
    this.pageNo =pageNo;
    this.saleProductEmployeeService.getMyOrders(pageNo,this.pageSize,this.search)
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.orders = data.data.infos;
          this.total =data.data.total;
        }
      })
  }
  loadFormData(data:any) {
    if(data.createTime){
      data.createTime = data.createTime.replace("T"," ");
    }
    if(data.payTime){
      data.payTime = data.payTime.replace("T"," ");
    }
    this.formData = [
      {
        title: '',
        type: 'bold',
        hd: ['系统订单号', "订单创建时间"],
        data: [data.id, data.createTime]
      },
      {
        title: "",
        type: "text",
        hd: ["订单状态", "付款时间"],
        data: [data.status, data.payTime]
      },
      {
        title: "收货人信息",
        type: "text",
        hd: ["收货人姓名", "收货人电话", "收货地址","备注"],
        data: [data.userName, data.telNumber, data.address,data.note]
      },
      {
        title: "商品明细",
        type: "form",
        hd: ["商品名称", "单价(元)", "商品类型", "数量", "合计（元）"],
        data: [[data.productName,data.total.toFixed(2),data.productType,"1",data.total.toFixed(2)]],
        total: "总计：￥" + data.total.toFixed(2)
      }
    ];
  }

}
