import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SupermarketCart} from "../../../../mode/supermarketCart/supermarket-cart.service";
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
  public username= sessionStorage.getItem("username");
  constructor(private marketManagerService: SupermarketManagerService,
              private errorVoid: ErrorResponseService,) { }

  ngOnInit() {
    this.getCartList();
  }

  getCartList(){
    this.marketManagerService.getCartList(this.username).subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        console.log(data);
        this.carts = data.data.infos;
        this.mutipalPrice=data.data.mutipalPrice;
        if(this.carts.length==0){
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
    this.marketManagerService.deleteCart(id,this.username)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data.status)) {
          alert("删除成功");
        }
        this.getCartList();
      });
  }

}
