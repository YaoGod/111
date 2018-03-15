import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import * as $ from 'jquery';
import {GoodsOrder, GoodsOrderItem} from "../goodsorder/goodsorder.component";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";

declare var $: any;
declare var confirmFunc: any;
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
  public pageNo = 1;
  public pageSize = 6;
  public total = 0;
  public orders:Array<GoodsOrder>;
  public productName = '';
  public orderId = '';
  public statusDesc = '';
  public beginTime = '';
  public endTime = '';
  public vegetableId = '';
  public deptId:string;
  private delId: any;
  public pages: Array<number>;
  public updateOrder={
    orderNo:'',
    status:0,
    note:''
  };
  public orderItems:Array<GoodsOrderItem>;
  public formData: Array<any>;
  public title: string = "商品预定区订单";
  constructor(private ipSetting: IpSettingService,
              private errorVoid: ErrorResponseService,
              private globalCatalogService: GlobalCatalogService) { }

  ngOnInit() {
    this.getRule();
    this.imgPrefix = this.ipSetting.ip;
    this.pages = [];
    this.getOrderAllList(1);
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
  getOrderAllList(i){
    this.pageNo = i;
    /*if(this.productName!=null){
      this.productName = this.productName.trim();
    }
    if(this.orderId!=null){
      this.orderId = this.orderId.trim();
    }
    if(this.vegetableId!=null){
      this.vegetableId = this.vegetableId.trim();
    }*/
    let dataSearch = {
      orderNo:this.orderId,
      status:this.statusDesc
    };
    let url = '/goodsOrder/list?userId=' + '' + '&pageNum='+ this.pageNo + '&pageSize=' +this.pageSize+ '&beginTime='+this.beginTime+
    '&endTime='+this.endTime;
    this.ipSetting.sendPost(url,dataSearch)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.orders = data.data.list;
          this.total =data.data.total;
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
      this.updateOrder.note = '';
    }
  }

  /*更新订单*/
  updateOrders(){
    if(this.updateOrder.status === 0){
      if(!this.isEmpty('notice','说明不能为空')){
        return false;
      }
    }
    let url = '/goodsOrder/updateOrderStatus?userId=' + localStorage.getItem("username")
    +'&orderNo=' + this.updateOrder.orderNo +'&status=' + this.updateOrder.status;
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示',
          'mes': data.msg,
          'popType': 0,
          'imgType': 1,
        });
        this.closeMask();
        this.getOrderAllList(1);
      }
    });
  }
  /**删除*/
  delete(orderid:number){
    let url = '/mmall/vegetabelOrder/deleteVegetableOrder/'+orderid;
    this.ipSetting.sendPost(url,null)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示',
            'mes': data['msg'],
            'popType': 0,
            'imgType': 1,
          });
          this.getOrderAllList(1);
        }
      });
  }

  closeMask() {
    $('.errorMessage').html('');
    $('.mask').hide();
  }

  /*装载要打印的内容*/
  loadFormData(data:any){
    this.formData =[
      {
        title:'',
        type: 'bold',
        hd:['系统订单号',"服务中心"],
        data: [data.orderNo,data.serviceCenter]
      },
      {
        title:"",
        type:"text",
        hd:["订单状态","付款方式","付款时间","发货时间"],
        data:[data.statusDesc,data.paymentTypeDesc,data.payTime,data.sendTime]
      },
      {
        title:"下单人信息",
        type:"text",
        hd:["下单人姓名","下单人电话","下单时间"],
        data:[data.userName,data.telPhone,data.createTime]
      },
      {
        title:"收货人信息",
        type:"text",
        hd:["收货人姓名","收货人电话","收货地址"],
        data:[data.receiver,data.telNumber,data.address]
      },
      {
        title:"商品明细",
        type:"form",
        hd:["商品名称","单价(元)","数量","合计（元）"],
        data:[],
        total:"总计：￥"+data.payment.toFixed(2)
      }
    ];
    /*switch(data.status){
      case '0':this.formData[1].data[0] = "已付款"; break;
      case '1':this.formData[1].data[0] = "已到货"; break;
      case '2':this.formData[1].data[0] = "退单"; break;
      case '40':this.formData[1].data[0] = "已配货"; break;
      default:
        this.formData[1].data[0] = "暂无订单状态信息";
    }*/
    for(let i = 0;i<data.orderItemVoList.length;i++){
      this.formData[this.formData.length-1].data[i]=[
        data.orderItemVoList[i].productName,
        '￥'+data.orderItemVoList[i].currentUnitPrice.toFixed(2),
        data.orderItemVoList[i].quantity,
        '￥'+data.orderItemVoList[i].totalPrice.toFixed(2)
      ];
    }
  }
  /**非空校验*/
  public isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if (data==null||data==''||data.trim() === '')  {
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
}
