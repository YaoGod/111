import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import * as $ from 'jquery';
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
declare var confirmFunc: any;

@Component({
  selector: 'app-goodscart',
  templateUrl: './goodscart.component.html',
  styleUrls: ['./goodscart.component.css'],
  providers: [ErrorResponseService]
})
export class GoodscartComponent implements OnInit {
  public imgPrefix: string;
  public cart: GoodsCart;
  public num:number;
  public carts:Array<GoodsCart>;
  public mutipalPrice:number;
  public serverCenters:Array<ServerCenter>;
  public serviceCenter: String;
  public payType: string;
  public myAddress = localStorage.getItem("address");
  public receiver = localStorage.getItem("showUserName");
  public telNumber = localStorage.getItem("teleNum");
  constructor(public ipSetting  : IpSettingService,
              private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.payType = '1';
    this.imgPrefix = this.ipSetting.ip;
    this.getCartList();

  }

  /** 获取购物车信息 **/
  getCartList(){
    let url = '/goodsCart/list?userId=' + localStorage.getItem("username");
    this.ipSetting.sendGet(url)
    .subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.carts = data.data.cartProductVoList;
        this.mutipalPrice=data.data.cartTotalPrice;
        if(this.carts.length === 0){
          $(".b-foot").hide();
        }else{
          $(".b-foot").show();
        }
      }
    });
  }

  /** 更新购物车*/
  cul(nums:number,productId:number){
    let url = '/goodsCart/update?userId=' + localStorage.getItem("username")
      + '&productId=' + productId + '&count=' + nums;
    this.ipSetting.sendGet(url)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.getCartList();
        }
      });
  }

  /** 购物车结算 **/
  balanceCart(){
    $('.maskSubmitOrder').show();
    this.serviceCenter = '';
    this.payType = '1';
    $('#message').val('');
  }

  /** 增加商品数量 **/
  onclikadd(idxx:number,productId:number){
    if($("#input-num-"+idxx+"").val().toString().trim()==""){
      $("#input-num-"+idxx+"").val(1);
    }else{
      $("#input-num-"+idxx+"").val(parseInt( $("#input-num-"+idxx+"").val()) + 1);
    }
    this.cul($("#input-num-"+idxx+"").val(),productId);
  }
  /** 减少商品数量 **/
  onclikjian(idxx:number,productId:number){
    if($("#input-num-"+idxx+"").val().toString().trim()==""){
      $("#input-num-"+idxx+"").val(1);
    }
    if( $("#input-num-"+idxx+"").val() <= 1) {
      confirmFunc.init({
        'title': '提示' ,
        'mes': "商品数量不能小于1",
        'popType': 0 ,
        'imgType': 2 ,
      });
      $("#input-num-"+idxx+"").val(1);
    } else {
      $("#input-num-"+idxx+"").val(parseInt( $("#input-num-"+idxx+"").val()) - 1);
    }
    this.cul($("#input-num-"+idxx+"").val(),productId);
  }

  del(id:number){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除？',
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        let url = '/goodsCart/deleteProduct?userId=' + localStorage.getItem("username") + '&productIds=' + id;
        this.ipSetting.sendGet(url)
          .subscribe(data => {
            if (this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': '删除成功',
                'popType': 0,
                'imgType': 1,
              });
              this.getCartList();
            }
          });
      }
    });
  }


  /*获取服务中心*/
  initFac(){
    /*let url = '/mmall/laundry/provider/initFac';
    this.ipSetting.sendPost(url,this.myOrder).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.serverCenters = data.data.centers;
      }
    });*/
  }
  /*提交订单*/
  submitOrder(){
  //  this.myOrder.serviceCenter="";
    $('.maskSubmitOrder').show();
  }

  getcode(){
    if(!this.verifyEmpty('serverCenter_add','服务中心不能为空')){
      return false;
    }
    let url = '/goodsOrder/getPayCode?userId='+localStorage.getItem("username");
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示' ,
          'mes': '短信发送成功！',
          'popType': 0 ,
          'imgType': 1 ,
        });

      }else{
        confirmFunc.init({
          'title': '提示' ,
          'mes': '短信发送失败！',
          'popType': 0 ,
          'imgType': 2 ,
        });
      }
    });
  }
  /*短信验证*/
  saveSubmitOrder(){
    if(!this.verifyEmpty('serverCenter_add','服务中心不能为空') || !this.verifyEmpty('receiver','收货人不能为空')||
      !this.verifyEmpty('telNumber','收货人电话不能为空') || !this.verifyEmpty('address','收货地址不能为空') ||
      !this. verifyEmpty('message','短信验证码不能为空')){
      return false;
    }
    let url = '/goodsOrder/pay?'+'userId='+localStorage.getItem("username") +'&serviceCenter=' + this.serviceCenter+
      '&payType='+ this.payType + '&receiver='+this.receiver+'&telNumber='+this.telNumber+'&address='+ $('#address').val() +
      '&payCode='+ $('#message').val();
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示' ,
          'mes': data['msg'],
          'popType': 0 ,
          'imgType': 1 ,
        });
        this.closeSubmitOrder();
        this.getCartList();
      }
    });
  }
  closeSubmitOrder() {
    $('.maskSubmitOrder').hide();
  }

  public verifyEmpty(id,label) {
    if (!this.isEmpty(id, label)) {
      return false;
    }else{
      return true;
    }
  }
  /**非空校验*/
  public isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if (data==null||data==''||data.trim() == '')  {
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
  public  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-control').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).siblings('span').html('输入错误');
    }else {
      $('#' + id).siblings('span').html(error);
    }
  }
  /**
   * 去除错误信息class
   * @param id
   */
  public  removeErrorClass(id: string) {
    $('#' + id).parents('.form-control').removeClass('form-error');
    $('#' + id).parents('.form-control').children('.form-inp').children('.errorMessage').html('');
    $('#' + id).next('span').html('');
  }

}

export class GoodsCart {
  productId:number;
  id:number;
  userId: string;
  productName: string;
  productMainImage: string;
  imgPath: string;
  productPrice:number;
  quantity:number;
  productChecked: string;
  detail: string;
  productTotalPrice: number;
  serviceCenter:string;
}

export class ServerCenter{
  name: string;
  id:number;
}
