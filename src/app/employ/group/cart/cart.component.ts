import { Component, OnInit } from '@angular/core';
import { GlobalCatalogService } from '../../../service/global-catalog/global-catalog.service';
import * as $ from 'jquery';
import { GroupCart} from '../../../mode/groupCart/group-cart.service';
import { GroupProductService } from '../../../service/group-product/group-product.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import {Router} from "@angular/router";
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers:[GroupProductService,ErrorResponseService]
})
export class CartComponent implements OnInit {

  public cart: GroupCart;
  public num:number;
  public carts:Array<GroupCart>;
  public mutipalPrice:number;
  constructor(
    private groupProductService: GroupProductService,
    private errorVoid: ErrorResponseService,
    private globalCatalogService: GlobalCatalogService,
    private router:Router
  ) {}


  ngOnInit() {
    this.globalCatalogService.setTitle("团购管理/购物车");
    this.getCartList();
  }
  getCartList(){
    this.groupProductService.getCartList().subscribe(data => {
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
    this.cart = new GroupCart();
    this.cart.productId = productId;
    this.cart.quantity = nums;
    this.groupProductService.updateGroupCart(this.cart)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data.status)) {
        }
        this.getCartList();
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
    this.groupProductService.deleteGroupCart(id)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data.status)) {
          alert("删除成功");
        }
        this.getCartList();
      });
  }
  linkConfirmCart(){
    this.router.navigate(["/hzportal/employ/group/confirmCart"]);
  }
}
