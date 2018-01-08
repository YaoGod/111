import { Component, OnInit } from '@angular/core';
import {SupermarketCart} from "../../../../mode/supermarketCart/supermarket-cart.service";
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import * as $ from 'jquery';
declare var confirmFunc:any;
@Component({
  selector: 'app-supbuysimple',
  templateUrl: './supbuysimple.component.html',
  styleUrls: ['./supbuysimple.component.css']
})
export class SupbuysimpleComponent implements OnInit {
  public cart: SupermarketCart;
  constructor(private supermarketManagerService: SupermarketManagerService,
              private errorVoid: ErrorResponseService,) { }

  ngOnInit() {
  }
  onclikadd(idxx:number,productId:number){
    if($("#input-num-"+idxx+"").val().toString().trim()==""){
      $("#input-num-"+idxx+"").val(1);
    }else{
      /*备注：报错被注释 2017/12/28*/
      $("#input-num-"+idxx+"").val( parseInt( $("#input-num-"+idxx+"").val()) + 1);
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
      /*备注：报错被注释 2017/12/28*/
      $("#input-num-"+idxx+"").val( parseInt( $("#input-num-"+idxx+"").val()) - 1);
    }
    this.cul($("#input-num-"+idxx+"").val(),productId);
  }
  cul(nums:number,productId:number){

  }
}
