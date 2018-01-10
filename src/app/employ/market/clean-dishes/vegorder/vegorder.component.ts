import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {VegetableOrder} from '../../../../mode/vegetableOrder/vegetable-order.service';
import {VegetableOrderItem} from '../../../../mode/vegetableOrderItem/vegetable-order-item.service'
import { VegetableInfoService } from '../../../../service/vegetable-info/vegetable-info.service';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import {forEach} from "@angular/router/src/utils/collection";


@Component({
  selector: 'app-vegorder',
  templateUrl: './vegorder.component.html',
  styleUrls: ['./vegorder.component.css'],
  providers: [VegetableInfoService,ErrorResponseService]

})
export class VegorderComponent implements OnInit {

  public search: VegetableOrder;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public orders:Array<VegetableOrder>;
  public productName:string = '';
  public orderId:string = '';
  public vegetableId:string = '';
  public deptId:string;
  private delId: any;
  public updateOrder={
    id:'',
    status:'',
    note:''
  };
  public formData: Array<any>;
  public title: string = "净菜订购区订单";

  public orderItems:Array<VegetableOrderItem>;
  constructor(private vegetableInfoService: VegetableInfoService,
              private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.pages = [];
    this.getOrderAllList();

  }
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
    this.vegetableInfoService.getOrderAllList(this.productName,this.orderId,this.vegetableId,this.pageNo,this.pageSize).subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        this.orders = data.data.infos;

        this.total = data.data.total;
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
    this.vegetableInfoService.updateOrder(this.updateOrder) .subscribe(data => {

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
    this.vegetableInfoService.deleteOrder( this.delId)
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
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    this.getOrderAllList();
  }
  /*装载要打印的内容*/
  loadFormData(data:any){
    this.formData =[
      {
        title:'',
        type: 'bold',
        hd:['系统订单号',"订单创建时间"],
        data: [data.id,data.createTime]
      },
      {
        title:"",
        type:"text",
        hd:["订单状态","服务中心"],
        data:["",data.serviceCenter]
      },
      {
        title:"收货人信息",
        type:"text",
        hd:["收货人姓名","收货人电话","付款时间"],
        data:[data.userName,data.telPhone,data.payTime]
      },
      {
        title:"商品明细",
        type:"form",
        hd:["商品名称","单价(元)","数量","合计（元）"],
        data:[],
        total:"总计：￥"+data.payment.toFixed(2)
      }
    ];
    switch(data.status){
      case '0':this.formData[1].data[0] = "已付款"; break;
      case '1':this.formData[1].data[0] = "已到货"; break;
      case '2':this.formData[1].data[0] = "退单"; break;
      case '4':this.formData[1].data[0] = "已配货"; break;
      default:
        this.formData[1].data[0] = "暂无订单状态信息";
    }
    for(let i = 0;i<data.vegetableOrderItems.length;i++){
      this.formData[3].data[i]=[
        data.vegetableOrderItems[i].productName,
        '￥'+data.vegetableOrderItems[i].unitPrice.toFixed(2),
        data.vegetableOrderItems[i].quantity,
        '￥'+data.vegetableOrderItems[i].totalPrice.toFixed(2)
      ];
    }
    console.log(this.formData);
  }
}
