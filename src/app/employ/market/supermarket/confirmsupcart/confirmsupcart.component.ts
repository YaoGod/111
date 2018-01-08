import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SupermarketCart} from "../../../../mode/supermarketCart/supermarket-cart.service";
import {SupermarketOrder} from "../../../../mode/supermarketOrder/supermarket-order.service";
import {ActivatedRoute, Router} from "@angular/router";
declare var confirmFunc:any;
@Component({
  selector: 'app-confirmsupcart',
  templateUrl: './confirmsupcart.component.html',
  styleUrls: ['./confirmsupcart.component.css'],
  providers: [SupermarketManagerService,ErrorResponseService]
})
export class ConfirmsupcartComponent implements OnInit {

  public cart: SupermarketCart;
  public num:number;
  public carts:Array<SupermarketCart>;
  public mutipalPrice:number;
  public leftMoney:number;
  public username= localStorage.getItem("username");
  public userInfo={
    username: '',
    teleNum: '',
    homeAddr: ''
  };
  public order:SupermarketOrder;
  constructor(private supermarketManagerService: SupermarketManagerService,
              private errorVoid: ErrorResponseService,
  private router:Router,
  private route:ActivatedRoute) { }
  ngOnInit() {
    this.getCartList();
    this.order = new SupermarketOrder();
  }
  getCartList(){
    this.supermarketManagerService.getCartList(this.username).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.carts = data.data.infos;
        this.mutipalPrice=data.data.mutipalPrice;
        this.userInfo=data.data.userInfo;
        this.leftMoney=data.data.leftMoney;
        if(this.carts.length==0){
          $(".b-foot").hide();
        }else{
          $(".b-foot").show();
        }
      }
    });
  }

  submitCart(){
    if(this.order.serviceCenter==null||this.order.serviceCenter.trim()===""){
      confirmFunc.init({
        'title': '提示' ,
        'mes': '请选择服务中心！',
        'popType': 0 ,
        'imgType': 2 ,
      });
      return false;
    }
    /**
     * 因短信接口暂不可用，请后续在此调用
     */

    this.supermarketManagerService.submitCart(this.order).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示' ,
          'mes': data.msg,
          'popType': 0 ,
          'imgType': 1 ,
        });
        $(".address").hide();
        $(".b-address").hide();
        $(".fuwu").hide();
        this.router.navigate(['../supbuy'],{relativeTo: this.route});
      }
    });
  }
}
