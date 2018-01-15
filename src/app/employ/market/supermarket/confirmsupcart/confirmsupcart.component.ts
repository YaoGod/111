import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SupermarketCart} from "../../../../mode/supermarketCart/supermarket-cart.service";
import {SupermarketOrder} from "../../../../mode/supermarketOrder/supermarket-order.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UtilBuildingService} from "../../../../service/util-building/util-building.service";
import {WorkspaceMydeskService} from "../../../../service/workspace-mydesk/workspace-mydesk.service";
declare var confirmFunc:any;
@Component({
  selector: 'app-confirmsupcart',
  templateUrl: './confirmsupcart.component.html',
  styleUrls: ['./confirmsupcart.component.css'],
  providers: [SupermarketManagerService,ErrorResponseService,UtilBuildingService,WorkspaceMydeskService]
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
  public serviceCenters:Array<any>;
  public djs: number;
  public yzm: string;
  constructor(
    private supermarketManagerService: SupermarketManagerService,
    private errorVoid: ErrorResponseService,
    private utilBuildingService:UtilBuildingService,
    private workspaceMydeskService:WorkspaceMydeskService,
    private router:Router,
    private route:ActivatedRoute)
  { }
  ngOnInit() {
    this.getCartList();
    this.order = new SupermarketOrder();
    this.getServiceCenterList();
  }
  /*获取订单内容*/
  getCartList(){
    this.supermarketManagerService.getCartList(this.username).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.carts = data.data.infos;
        this.mutipalPrice=data.data.mutipalPrice;
        this.userInfo=data.data.userInfo;
        this.leftMoney=data.data.leftMoney?data.data.leftMoney:0;
        if(this.carts.length==0){
          $(".b-foot").hide();
        }else{
          $(".b-foot").show();
        }
      }
    });
  }
  /*获取默认的服务中心*/
  getServiceCenter(){
    this.utilBuildingService.getServiceCenter()
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.order.serviceCenter = data.data;
        }
      })
  }
  /*获取服务中心列表*/
  getServiceCenterList(){
    this.workspaceMydeskService.getServiceCenter()
      .subscribe((data)=>{
        if(this.errorVoid.errorMsg(data)){
          this.serviceCenters = data.data;
          this.getServiceCenter();
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
    if(typeof (this.yzm) === "undefined" || this.yzm === null || this.yzm === ""){
      confirmFunc.init({
        'title': '提示' ,
        'mes': '请输入验证码！',
        'popType': 0 ,
        'imgType': 2 ,
      });
      return false;
    }
    this.supermarketManagerService.submitCart(this.order,this.yzm)
      .subscribe(data => {
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
        'imgType': 2 ,
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
       this.supermarketManagerService.getYzm(this.username)
       .subscribe(data=>{
       if(this.errorVoid.errorMsg(data)){
       confirmFunc.init({
       'title': '提示',
       'mes': '验证码已发送到'+this.userInfo.teleNum+'，请注意查收！',
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
