import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import {VegetableCart} from '../../../../mode/vegetableCart/vegetable-cart.service';
import { VegetableInfoService } from '../../../../service/vegetable-info/vegetable-info.service';
declare var confirmFunc:any;
@Component({
  selector: 'app-vegcart',
  templateUrl: './vegcart.component.html',
  styleUrls: ['./vegcart.component.css'],
  providers: [VegetableInfoService,ErrorResponseService]
})
export class VegcartComponent implements OnInit {
  public cart: VegetableCart;
  public num:number;
  public carts:Array<VegetableCart>;
  public mutipalPrice:number;
  constructor(private vegetableInfoService: VegetableInfoService,
              private errorVoid: ErrorResponseService,) { }

  ngOnInit() {
    this.getCartList();

  }
  getCartList(){
    this.vegetableInfoService.getCartList().subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
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
    this.cart = new VegetableCart();
    this.cart.productId = productId;
    this.cart.quantity = nums;
    this.vegetableInfoService.updateVegetableCart(this.cart)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
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
      confirmFunc.init({
        'title': '提示' ,
        'mes': '提示：商品数量不能小于1！',
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
        this.vegetableInfoService.deleteVegetableCart(id)
          .subscribe(data => {
            if (this.errorVoid.errorMsg(data)) {
              console.log(data);
              confirmFunc.init({
                'title': '提示' ,
                'mes': data['msg'],
                'popType': 0 ,
                'imgType': 1 ,
              });
              this.getCartList();
            }
          });
      }
    });
  }
}
