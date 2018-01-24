import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SupermarketCart} from "../../../../mode/supermarketCart/supermarket-cart.service";
declare var confirmFunc:any;
@Component({
  selector: 'app-mycart',
  templateUrl: './mycart.component.html',
  styleUrls: ['./mycart.component.css'],
  providers: [SupermarketManagerService,ErrorResponseService]
})
export class MycartComponent implements OnInit {
  public cart: SupermarketCart;
  public num:number;
  public carts:Array<SupermarketCart>;
  public mutipalPrice:number;
  public username= localStorage.getItem("username");
  constructor(private marketManagerService: SupermarketManagerService,
              private errorVoid: ErrorResponseService,) { }

  ngOnInit() {
    this.getCartList();
  }

  getCartList(){
    this.marketManagerService.getCartList(this.username)
      .subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {

        this.carts = data.data.infos;
        this.mutipalPrice=data.data.mutipalPrice;
        if(this.carts.length===0){
          $(".b-foot").hide();
        }else{
          $(".b-foot").show();
        }
      }
    });
  }

  cul(nums:number,productId:number){
    this.cart = new SupermarketCart();
    this.cart.productId = productId;
    this.cart.quantity = nums;
    this.marketManagerService.updateCart(this.cart,this.username)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          this.getCartList();
        }
      });
  }

  onclikadd(idxx:number,productId:number){
    if($("#input-num-"+idxx+"").val().toString().trim()==""){
      $("#input-num-"+idxx+"").val(1);
    }else{
      $("#input-num-"+idxx+"").val(parseInt( $("#input-num-"+idxx+"").val()) + 1);
      this.cul($("#input-num-"+idxx+"").val(),productId);
    }
  }
  onclikjian(idxx:number,productId:number){
    if($("#input-num-"+idxx+"").val().toString().trim()==""){
      $("#input-num-"+idxx+"").val(1);
    }
    if( $("#input-num-"+idxx+"").val() <= 1) {
      $("#input-num-"+idxx+"").val(1);
    } else {
      $("#input-num-"+idxx+"").val(parseInt( $("#input-num-"+idxx+"").val()) - 1);
      this.cul($("#input-num-"+idxx+"").val(),productId);
    }
  }

  del(id:number){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除该商品',
      'popType': 1,
      'imgType': 3,
      'callback': ()=>{
        this.marketManagerService.deleteCart(id,this.username)
          .subscribe(data => {
            if (this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 0,
                'imgType': 1,
              });
              this.getCartList();
            }
          });
      }
    });

  }

}
