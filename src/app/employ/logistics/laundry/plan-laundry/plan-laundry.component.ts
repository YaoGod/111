import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
declare var $: any;
declare var confirmFunc: any;
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {IpSettingService} from "app/service/ip-setting/ip-setting.service";

@Component({
  selector: 'app-plan-laundry',
  templateUrl: './plan-laundry.component.html',
  styleUrls: ['./plan-laundry.component.css'],
  providers: [ErrorResponseService]
})
export class PlanLaundryComponent implements OnInit {
  public products:Array<FacPrice>;
  public applierList:Array<Facilitator>;
  public serverCenters:Array<ServerCenter>;
  public myOrder:LaundryOrder;
  public orders:Array<LaundryOrder>;
  public days:string;
  private code: any;
  public username= localStorage.getItem("username");
  /*当前页码*/
  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public orderItemAdd={
    orderId:'',
    appcontent:   '',
    unitPrice:  '',
    quantity:   '',
    totalPrice:  '',
    applyid: '',
    unit: ''
  };

  constructor(private ipSetting: IpSettingService,private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.pages = [];
    this.myOrder = new LaundryOrder();
    this.initFac();
    this.getOrderList();
  }

  initFac(){
    let url = '/mmall/laundry/provider/initFac';
    this.ipSetting.sendPost(url,this.myOrder).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.applierList = data.data.providers;
        this.serverCenters = data.data.centers;

      }
    });
  }
  /*提交订单*/
  submitOrder(){
    this.myOrder.serviceCenter=""
    $('.maskSubmitOrder').show();
  }

  getcode(){

    let url = '/mmall/laundryOrder/getPayCode/'+this.username;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(data['status'] === 0){
        alert("短信发送成功！");

      }else{
        alert("短信发送失败！");
      }
    });

  }
  saveSubmitOrder(){
    if(!this.verifyEmpty('serverCenter_add','服务中心不能为空')){
      return false;
    }
    if(!this. verifyEmpty('message','短信验证码不能为空')){
      return false;
    }

    let url = '/mmall/laundryOrder/addOrder/'+$('#message').val();
    this.ipSetting.sendPost(url,this.myOrder).subscribe(data => {
      if(data['status'] === 0){

        alert(data['msg']);
        this.closeSubmitOrder();
        this.getOrderList();
      }else{
        alert(data['msg']);
      }
    });
  }
  closeSubmitOrder() {
    $('.maskSubmitOrder').hide();
  }
  changeContent(){
    this.orderItemAdd.appcontent = "";
    for(let i=0;i<this.applierList.length;i++){
      if(this.applierList[i].applyId ==  this.orderItemAdd.applyid){
        this.products = this.applierList[i].prices;
      }
    }
  }

  changeContent1(){
    for(let i=0;i<this.products.length;i++){
      if(this.products[i].appcotent ==  this.orderItemAdd.appcontent){
        this.orderItemAdd.unit = this.products[i].unit;
        this.orderItemAdd.unitPrice = this.products[i].price+'';
      }
    }
  }

  onclikadd(){
    if(this.orderItemAdd.quantity==""){
      this.orderItemAdd.quantity=1+'';
    }else{
      this.orderItemAdd.quantity=(parseInt(this.orderItemAdd.quantity) + 1)+'';
    }
  }
  onclikjian(){
    if(this.orderItemAdd.quantity==""){
      this.orderItemAdd.quantity=1+'';
    }
    if(parseInt(this.orderItemAdd.quantity) <= 1) {
      alert("提示：商品数量不能小于1");
      this.orderItemAdd.quantity=1+'';
    } else {
      this.orderItemAdd.quantity=(parseInt(this.orderItemAdd.quantity) - 1)+'';
    }
  }

  getOrderList(){
    let url = '/mmall/laundryOrder/getOrderList/-1';
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.orders = data.data.infos;
        this.myOrder.id = data.data.orderId;

        this.total = data.data.total;
      }
    });
  }
  /*删除*/
  okFunc() {
    $('.confirm').hide();
    let url = "/mmall/laundryOrder/deleteOrder/"+this.code;
    this.ipSetting.sendPost(url,this.myOrder).subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        alert("删除成功");
      }
      this.getOrderList();
    });
  }

  addOrderItem() {

    /* if(!this.verifyEmpty('serverCenter_add','服务中心不能为空')){
     return false;
     }*/
    if(!this.verifyEmpty("quantity_add","洗衣数量不能为空")){
      return false;
    }
    if(!this.verifyEmpty("supplierId_add","服务商不能为空")){
      return false;
    }
    if(!this.verifyEmpty("appcotent_add","服务内容不能为空")){
      return false;
    }
    this.orderItemAdd.orderId = this.myOrder.id+'';
    let url = "/mmall/laundryOrder/addOrderItem";
    this.ipSetting.sendPost(url,this.orderItemAdd).subscribe(data => {
      if(data['status'] === 0){

        alert(data['msg']);
        this.closeMaskAdd();
        this.getOrderList();
      }else{
        alert(data['msg']);
      }
    })
  }

  /**非空校验*/
  private isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if (data==null||data==''||data.trim() == '')  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }

  private checkPrice(id){
    let reg =/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
    if(!reg.test($('#' + id).val())){
      this.addErrorClass(id, "请输入正确的价格");
      return true;
    }
  }

  private verifyEmpty(id,label) {
    if (!this.isEmpty(id, label)) {
      return false;
    }else{
      return true;
    }
  }


  delete(code: number) {
    this.code = code;
    $('.confirm').fadeIn();
  }

  noFunc() {
    $('.confirm').fadeOut();
  }
  add() {
    this.myOrder.serviceCenter="";
    this.orderItemAdd.orderId = this.myOrder.id+'';
    this.orderItemAdd.quantity =1+'';
    $('.maskAdd').show();
  }
  closeMaskAdd() {
    $('.maskAdd').hide();
    this.orderItemAdd={
      orderId:'',
      appcontent:   '',
      unitPrice:  '',
      quantity:   '',
      totalPrice:  '',
      applyid: '',
      unit: ''
    };
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
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    this.getOrderList();
  }


}
export class FacPrice {
  orderId:number;
  priceId;    number;
  applyid:          string;
  appcotent:        string;
  unit:              string;
  price:             number;
  appliar:           string;
}
export class Facilitator {
  applyId:          string;/*经销商id*/
  applyName:        string;/*经销商名称*/
  copStarttime:     string;/*合作开始时间*/
  copEndtime:       string;/*合作结束时间*/
  applyDesc:        string;/*描述*/
  prices: Array<FacPrice>;
}
export class LaundryOrder {
  id:number;
  serviceCenter:           string;
  orderItems: Array<LaundryOrderItem>;
}
export class  LaundryOrderItem{
  id:number;
  orderId:  number;
  appcontent:   string;
  unitPrice:  number;
  quantity:   number;
  totalPrice:  number;
  applyid: string;
  unit: number;
}
export class ServerCenter{
  name: string;
  id:number;
}

