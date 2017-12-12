import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { GroupCart} from '../../../mode/groupCart/group-cart.service';
import { GroupProductService } from '../../../service/group-product/group-product.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { Router } from '@angular/router';
import {GlobalCatalogService} from "app/service/global-catalog/global-catalog.service";
@Component({
  selector: 'app-confirm-cart',
  templateUrl: './confirm-cart.component.html',
  styleUrls: ['./confirm-cart.component.css'],
  providers:[GroupProductService,ErrorResponseService]
})
export class ConfirmCartComponent implements OnInit {

  public cart: GroupCart;
  public num:number;
  public carts:Array<GroupCart>;
  public mutipalPrice:number;
  public ids:string;
  constructor(
    private groupProductService: GroupProductService,
    private errorVoid: ErrorResponseService,
    private router: Router,
    private globalCatalogService: GlobalCatalogService
  ) {}
  public userInfo={
  username: '',
  teleNum: '',
  homeAddr: ''
}
  ngOnInit() {
    this.globalCatalogService.setTitle("团购管理/购物车/确认订单");
    this.getCartList();
  }
  getCartList(){
    this.groupProductService.getCartList().subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        console.log(data);
        this.carts = data.data.infos;
        this.mutipalPrice=data.data.mutipalPrice;
        this.userInfo = data.data.userInfo;
        if(this.carts.length==0){
          $(".b-foot").hide();
        }else{
          $(".b-foot").show();
        }
      }
    });
  }

  submitCart(){
    this.groupProductService.submitCart().subscribe(data => {
      if (data.status=="1") {
        alert("您的订单提交失败！");
      }else{
        alert("您的订单提交成功！");
        this.getCartList();
        $(".address").hide();
        $(".b-address").hide();
      }
    });
  }
}
