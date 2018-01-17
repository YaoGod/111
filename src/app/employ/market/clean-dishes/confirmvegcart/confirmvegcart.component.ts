import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import {VegetableCart} from '../../../../mode/vegetableCart/vegetable-cart.service';
import {VegetableInfoService } from '../../../../service/vegetable-info/vegetable-info.service';
import {VegetableOrder} from '../../../../mode/vegetableOrder/vegetable-order.service';
import {ActivatedRoute, Router} from "@angular/router";
declare var confirmFunc:any;

@Component({
  selector: 'app-confirmvegcart',
  templateUrl: './confirmvegcart.component.html',
  styleUrls: ['./confirmvegcart.component.css'],
  providers: [VegetableInfoService,ErrorResponseService]
})
export class ConfirmvegcartComponent implements OnInit {

  public cart: VegetableCart;
  public num:number;
  public carts:Array<VegetableCart>;
  public mutipalPrice:number;
  public leftMoney:number;
  public userInfo={
    username: '',
    teleNum: '',
    homeAddr: ''
  };
  public djs: number;
  public yzm: string;
  public order:VegetableOrder;
  public username= localStorage.getItem("username");
  constructor(private vegetableInfoService: VegetableInfoService,
              private errorVoid: ErrorResponseService,
              private router:Router,
              private route:ActivatedRoute) { }

  ngOnInit() {
    this.getCartList();
    this.order = new VegetableOrder();
  }
  getCartList(){
    this.vegetableInfoService.getCartList().subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {

        this.carts = data.data.infos;
        this.mutipalPrice=data.data.mutipalPrice;
        this.userInfo=data.data.userInfo;
        this.leftMoney= data.data.leftMoney;
        if(this.carts.length==0){
          $(".b-foot").hide();
        }else{
          $(".b-foot").show();
        }
      }
    });
  }

  submitCart(){
    if(this.order.serviceCenter==null||this.order.serviceCenter.trim()==""){
      confirmFunc.init({
        'title': '提示' ,
        'mes': '请选择服务中心！',
        'popType': 0 ,
        'imgType': 2 ,
      });
      return false;
    }
    /**
     * 因短信接口暂不可用，请后续在此调用--start
     */
    if(typeof (this.yzm) === "undefined" || this.yzm === null || this.yzm === ""){
      confirmFunc.init({
        'title': '提示' ,
        'mes': '请输入验证码！',
        'popType': 0 ,
        'imgType': 2 ,
      });
      return false;
    }

    this.vegetableInfoService.submitCart(this.order,this.yzm).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示' ,
          'mes': data.msg,
          'popType': 0 ,
          'imgType': 1 ,
        });
        this.getCartList();
        $(".address").hide();
        $(".b-address").hide();
        $(".fuwu").hide();
        this.router.navigate(['../vegbuy'],{relativeTo: this.route});
      }
    });
  }
  payCount(){
    if(this.leftMoney>0){
      $('.maskYzm').show();
      this.djs = 0;
      this.getYzm();
    }else{
      confirmFunc.init({
        'title': '提示' ,
        'mes': '账户余额不足，请先充值！',
        'popType': 0 ,
        'imgType': 1 ,
      });
    }
  }
  /*获取验证码*/
  getYzm(){
    if(this.djs === 0){
      this.djs = 90;
      setInterval(()=>{
        if(this.djs>0){
          this.djs  = this.djs -1;
        }
      },1000);
      this.vegetableInfoService.getYzm(this.username)
        .subscribe(data=>{
          if(this.errorVoid.errorMsg(data)){
            confirmFunc.init({
              'title': '提示',
              'mes': '验证码已发送！',
              'popType': 0,
              'imgType': 1,
            });
          }
        })
    }
  }
  closeMask() {
    $('.maskYzm').hide();
  }
}
