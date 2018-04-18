import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SaleProductEmployeeService} from "../../../../service/sale-product-employee/sale-product-employee.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SaleProduct, UserSale} from "../../../../mode/saleProduct/sale-product.service";
import {GlobalUserService} from "../../../../service/global-user/global-user.service";
import {getResponseURL} from "@angular/http/src/http_utils";
declare var $:any;
declare var confirmFunc:any;
@Component({
  selector: 'app-sale-detail',
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.component.css']
})
export class SaleDetailComponent implements OnInit {

  public saleProduct:SaleProduct;
  public userSale:UserSale;
  public user:any;
  public status:string;
  public code:string;
  public yzm :string;
  public clickTime: number;
  public types : Array<string>;
  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private gobalUserService:GlobalUserService,
    private saleProductEmployeeService:SaleProductEmployeeService,
    private errorResponseService:ErrorResponseService
  ) { }

  ngOnInit() {
    this.saleProduct = new SaleProduct();
    this.userSale = new UserSale();
    this.user = this.gobalUserService.getVal();
    this.status = "";
    let tempid: number = 0;
    this.clickTime = 0;
    this.types = [];
    this.route.params.subscribe(data => {
      if(tempid === 0){
        this.saleProduct.id = data.id;
        this.getSaleProduct(data.id);
        tempid ++;
      }
    });
  }
  /*获取商品详情*/
  getSaleProduct(id){
    this.saleProductEmployeeService.getSaleProduct(id)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.saleProduct=data.data;
          this.saleProduct.imgPath = this.saleProduct.imgPathList[0];
          this.userSale.productName = this.saleProduct.name;
          this.types = this.saleProduct.type.split(",");
          this.userSale.productType = this.types[0];
          this.getSystemTime();
        }
      })
  }
  /*获取商品抢购资格*/
  getSaleProductKey(id){
    this.clickTime ++;
    $('#mask').show();
    // console.log(this.userSale.productType );
    if(this.clickTime === 1){
      this.saleProductEmployeeService.getSaleProductKey(this.user.userid ,id)
        .subscribe(data=>{
          this.clickTime = 0;
            $('#mask').hide();
            if(this.errorResponseService.errorMsg(data)){
              $('#order').show();
              this.code = data.data;
              this.userSale.productId = this.saleProduct.id;
              this.userSale.userName = this.user.username;
              this.userSale.telNumber = this.user.teleNum;
              this.userSale.address = this.user.homeAddr;
            }
          },
          response => {
            this.clickTime = 0;
            $('#mask').hide();
            console.log("PUT call in error", response);
          });
    }
  }
  /*与系统时间对时*/
  getSystemTime(){
    this.saleProductEmployeeService.getTime()
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          let nowTime = Date.parse(new Date().toString());
          let sysTime = Date.parse(data.data);
          let addTime = sysTime-nowTime;  /*补益差值*/
          this.timeDjs(this.saleProduct.beginTime, this.saleProduct.endTime,addTime,this.saleProduct.realNumber);
          let BeginTime = Date.parse(this.saleProduct.beginTime);
          let leftTime = BeginTime-nowTime;
          if(leftTime<=300000){
            setInterval(()=>{
              this.timeDjs(this.saleProduct.beginTime, this.saleProduct.endTime,addTime,this.saleProduct.realNumber);
            },500);
          }else{
            setInterval(()=>{
              this.timeDjs(this.saleProduct.beginTime, this.saleProduct.endTime,addTime,this.saleProduct.realNumber);
            },120000);
          }
        }
      })
  }
  /*获取时间比对*/
  timeDjs(bDate,eDate,addTime,realNumber){
    let BeginTime = Date.parse(bDate);
    let EndTime  = eDate?Date.parse(eDate):Date.parse(new Date().toString());
    let nowTime = Date.parse(new Date().toString())+addTime;
    /*活动未开始*/
    if(BeginTime>nowTime){
      this.status = "waitTime";
      let leftTime = BeginTime-nowTime;
      if( leftTime<=60000){
        // console.log(leftTime / 1000);
      }
    }
    /*活动已结束*/
    else if(nowTime>=EndTime  && realNumber === 0){
      this.status = "end";
    }
    else{
      this.status = "progress";
    }
  }
  /*判断textarea的行数自适应*/
  definedRows(){
    let length = $("#content").val().split(/\r?\n/).length;
    return length+1;
  }
  /*查看图片*/
  chooseImg(i){
    this.saleProduct.imgPath = this.saleProduct.imgPathList[i];
  }
  /*获取验证码*/
  getYzm(id){
    this.saleProductEmployeeService.getYzm(id)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          confirmFunc.init({
            'title': '提示',
            'mes': '验证码已发送，请注意查收！',
            'popType': 0,
            'imgType': 1,
          });
        }
      })
  }
  /*确认订单*/
  submitOrder(){
    let error = 0;
    this.verifyEmpty(this.yzm,'yzm');
    if($('.red').length === 0 && error === 0) {
      this.userSale.amount = 1;
      this.userSale.total = this.saleProduct.price;
      this.saleProductEmployeeService.addUserSaleOrder(this.code, this.userSale, this.yzm)
        .subscribe(data => {
          if (this.errorResponseService.errorMsg(data)) {
            $('#order').hide();
            confirmFunc.init({
              'title': '提示',
              'mes': data.msg,
              'popType': 0,
              'imgType': 1,
            });
          }
        })
    }
  }
  /*放弃订单*/
  closeOrder(){
    confirmFunc.init({
      'title': '提示',
      'mes': '关闭将会放弃订单，是否确认此操作？',
      'popType': 1,
      'imgType': 3,
      "callback": () => {
        $('#order').hide();
      }
    });

  }
  /*非空验证*/
  verifyEmpty( value, id?){
    if(typeof (value) === "undefined" ||
      value === null ||
      value === ''){
      this.addErrorClass(id,'该值不能为空');
      return false;
    }else{
      this.removeErrorClass(id);
      return true;
    }
  }
  /* 添加错误信息*/
  private addErrorClass(id: string, error: string)  {
    $('#' + id).addClass('red');
    $('#' + id).parent().next('.error').fadeIn().html(error);
  }
  /*去除错误信息*/
  private  removeErrorClass(id: string) {
    $('#' + id).removeClass('red');
    $('#' + id).parent().next('.error').fadeOut();
  }
}
