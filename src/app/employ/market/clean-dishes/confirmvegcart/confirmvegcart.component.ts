import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import {VegetableCart} from '../../../../mode/vegetableCart/vegetable-cart.service';
import {VegetableInfoService } from '../../../../service/vegetable-info/vegetable-info.service';
import {VegetableOrder} from '../../../../mode/vegetableOrder/vegetable-order.service';

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
  }
 public order:VegetableOrder;
  constructor(private vegetableInfoService: VegetableInfoService,
              private errorVoid: ErrorResponseService,) { }

  ngOnInit() {
    this.getCartList();
    this.order = new VegetableOrder();
  }
  getCartList(){
    this.vegetableInfoService.getCartList().subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        console.log(data);
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
    if(this.order.serviceCenter==null||this.order.serviceCenter.trim()==""){
      alert("请选择服务中心！");
      return false;
    }
    /**
     * 因短信接口暂不可用，请后续在此调用--start
     */



    /**
     * 因短信接口暂不可用，请后续在此调用--end
     */
    this.vegetableInfoService.submitCart(this.order).subscribe(data => {
      if (data.status=="1") {
        alert(data.msg);
      }else{
        alert(data.msg);
        this.getCartList();
        $(".address").hide();
        $(".b-address").hide();
        $(".fuwu").hide();
      }
    });
  }

}
