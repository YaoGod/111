import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import * as $ from 'jquery';
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
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
  constructor(private ipSetting  : IpSettingService,
              private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.imgPrefix = this.ipSetting.ip;
    this.getCartList();

    $('.list-table dl').click(function () {
      $(this).addClass('blueself').siblings().removeClass('blueself').find('.ope-list').addClass('hid');
      $(this).find('.ope-list').removeClass('hid');
    })
  }

  /*
  * 获取购物车信息
  * */
  getCartList(){
    let url = '/goodsCart/list?userId=' + localStorage.getItem("username");
    this.ipSetting.sendGet(url)
    .subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {

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

  /*
  * 更新购物车
  * */
  cul(nums:number,productId:number){
    let url = '/goodsCart/update?userId=' + localStorage.getItem("username")
      + '&productId=' + productId + '&count=' + nums;
    this.ipSetting.sendGet(url)
      .subscribe(data => {
        if(data['status'] === 1){
          alert(data['msg']);
          this.getCartList();
        }else{
          this.getCartList();
        }
      });
  }

  onclikadd(idxx:number,productId:number){
    if($("#input-num-"+idxx+"").val().toString().trim()==""){
      $("#input-num-"+idxx+"").val(1);
    }else{
      $("#input-num-"+idxx+"").val(parseInt( $("#input-num-"+idxx+"").val()) + 1);
    }
    this.cul($("#input-num-"+idxx+"").val(),productId);
  }
  onclikjian(idxx:number,productId:number){
    if($("#input-num-"+idxx+"").val().toString().trim()==""){
      $("#input-num-"+idxx+"").val(1);
    }
    if( $("#input-num-"+idxx+"").val() <= 1) {
      alert("提示：商品数量不能小于1");
      $("#input-num-"+idxx+"").val(1);
    } else {
      $("#input-num-"+idxx+"").val(parseInt( $("#input-num-"+idxx+"").val()) - 1);
    }
    this.cul($("#input-num-"+idxx+"").val(),productId);
  }

  del(id:number){
    let url = '/goodsCart/deleteProduct?userId=' + localStorage.getItem("username")
        + '&productIds=' +id;
    this.ipSetting.sendGet(url)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data.status)) {
          alert("删除成功");
        }
        this.getCartList();
      });
  }
}

export class GoodsCart {
  productId:number;
  id:number;
  userId: string;
  productName: string;
  productMainImage: string;
  productPrice:number;
  quantity:number;
  productChecked: string;
  detail: string;
  productTotalPrice: number;
  serviceCenter:string;

}

