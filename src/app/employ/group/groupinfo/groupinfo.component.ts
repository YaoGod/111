import { Component, OnInit } from '@angular/core';
import { GroupProduct } from '../../../mode/groupProduct/group-product.service';
import {GroupProductService} from "../../../service/group-product/group-product.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GroupCart} from "../../../mode/groupCart/group-cart.service";
declare var $:any;
declare var confirmFunc: any;
@Component({
  selector: 'app-groupinfo',
  templateUrl: './groupinfo.component.html',
  styleUrls: ['./groupinfo.component.css'],
  providers:[GroupProductService,ErrorResponseService]
})
export class GroupinfoComponent implements OnInit {

  public imgUrl: Array<string>;
  public discount: GroupProduct;
  public cart:GroupCart;
  public cartsize:number;
  public proId:number;
  public showImg:string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private groupProductService: GroupProductService,
    private errorVoid: ErrorResponseService,
    public  ipSetting:IpSettingService,
  ) { }

  ngOnInit() {
    this.discount = new GroupProduct();
    this.route.params.subscribe(data => {
      this.proId = data.id;
      this.update(data.id);
    });
    this.getProductShowList();
  }
  /*获取商品列表*/
  getProductShowList(){
    let url = '/mmall/group/getProductShowList/1/5';
    this.ipSetting.sendPost(url,{})
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.cartsize = data.data.cartsize;
        }
      });
  }
  update(code: string) {
    this.groupProductService.getGroupProduct(code)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.discount = data.data;
          if(this.discount.imgPath!==null){
            this.discount.imgPath = this.discount.imgPath.split(';');
            for(let i = 0 ;i<this.discount.imgPath.length;i++) {
              if(this.discount.imgPath[i] === "" || typeof(this.discount.imgPath[i]) === "undefined") {
                this.discount.imgPath.splice(i,1);
                i= i-1;
              }
            }
            this.showImg = this.discount.imgPath[0];
          }

        }
      })
  }
  addToCart(id){
    if(this.cartsize>0){
      confirmFunc.init({
        'title': '提示' ,
        'mes': '请先结算或清空购物车！',
        'popType': 0 ,
        'imgType': 2 ,
      });
      return false;
    }
    this.cart = new GroupCart();
    this.cart.productId = id;
    this.groupProductService.addToCart(this.cart)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.cartsize = data.data.cartsize;
          confirmFunc.init({
            'title': '提示' ,
            'mes': '预定成功:已加入购物车！',
            'popType': 0 ,
            'imgType': 1 ,
          });
        }
      })
  }
  /*查看图片*/
  chooseImg(i){
    this.showImg = this.discount.imgPath[i];
  }
  /*判断textarea的行数自适应*/
  definedRows(){
    let length = $("#summary").val().split(/\r?\n/).length;
    return length+1;
  }
}
