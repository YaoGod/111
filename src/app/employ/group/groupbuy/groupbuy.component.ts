import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { GlobalCatalogService } from '../../../service/global-catalog/global-catalog.service';
import { GroupProduct } from '../../../mode/groupProduct/group-product.service';
import { GroupProductService } from '../../../service/group-product/group-product.service';
import { GroupNotice } from '../../../mode/groupNotice/group-notice.service';
import { GroupCart} from '../../../mode/groupCart/group-cart.service';
import { GroupNoticeService } from '../../../service/group-notice/group-notice.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import * as $ from 'jquery';
declare var $:any;
declare var confirmFunc: any;
declare var tinymce: any;
declare var $:any;
declare var confirmFunc: any;
declare var tinymce: any;
@Component({
  selector: 'app-groupbuy',
  templateUrl: './groupbuy.component.html',
  styleUrls: ['./groupbuy.component.css'],
  providers:[GroupProductService,ErrorResponseService,GroupNoticeService]
})
export class GroupbuyComponent implements OnInit {
  public groupProducts: Array<GroupProduct>;
  public search:GroupProduct;
  public  cart:GroupCart;
  public groupNotices: Array<GroupNotice>;
  public cartsize:number;
  private pageNo: number = 1;
  /*当前页码*/
  private pageSize: number = 5;
  constructor( private globalCatalogService: GlobalCatalogService,
  private groupProductService: GroupProductService,
              private groupNoticeService: GroupNoticeService,
              private errorVoid: ErrorResponseService,
  private router:Router){
  }

  ngOnInit() {
    this.search = new GroupProduct();
    this.globalCatalogService.setTitle("员工服务/员工团购网/商品订购");
    this.getProductShowList();
    this.getNoticeList();
  }
  getProductShowList(){
    this.groupProductService.getProductShowList(this.pageNo,this.pageSize,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.groupProducts = data.data.infos;

        this.cartsize = data.data.cartsize;
      }
    });
  }

  /*获取公告列表*/
  getNoticeList() {
    this.groupNoticeService.getNoticeList(this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.groupNotices = data.data.infos;
      }
    });
  }
  addToCart(id: number){
    this.cart = new GroupCart();
    this.cart.productId = id;
    this.groupProductService.addToCart(this.cart)
      .subscribe(data => {
        if(data['status']===0){
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
  onclikadd(idxx:number,productId:number){
    if($("#input-num-"+idxx+"").val().toString().trim()===""){
      $("#input-num-"+idxx+"").val(1);
    }else{
      $("#input-num-"+idxx+"").val(parseInt( $("#input-num-"+idxx+"").val()) + 1);
    }
    this.cul($("#input-num-"+idxx+"").val(),productId);
  }
  onclikjian(idxx:number,productId:number){
    if($("#input-num-"+idxx+"").val().toString().trim()===""){
      $("#input-num-"+idxx+"").val(1);
    }
    if( $("#input-num-"+idxx+"").val() <= 1) {
      confirmFunc.init({
        'title': '提示' ,
        'mes': '提示：商品数量不能小于1',
        'popType': 0 ,
        'imgType': 1 ,
      });
      $("#input-num-"+idxx+"").val(1);
    } else {
      $("#input-num-"+idxx).val(parseInt( $("#input-num-"+idxx).val()) - 1);
    }
    this.cul($("#input-num-"+idxx+"").val(),productId);
  }
  cul(nums:number,productId:number){
    this.cart = new GroupCart();
    this.cart.productId = productId;
    this.cart.quantity = nums;
    this.groupProductService.updateGroupCart(this.cart)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
        }
       // this.getCartList();
      });
  }
  viewNotice(){
    this.groupNoticeService.getNoticeShowList().subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.groupNotices = data.data.infos;

      }
    });
    $('.mask').show();
  }

  closeMask() {
    $('.mask').hide();
  }
}
