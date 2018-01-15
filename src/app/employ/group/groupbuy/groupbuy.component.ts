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
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
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
  /*当前页码*/
  public pageSize = 6;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public groupNotice = {
    title: '',
    notice: ''
  }
  constructor( private globalCatalogService: GlobalCatalogService,
  private groupProductService: GroupProductService,
              private groupNoticeService: GroupNoticeService,
              private errorVoid: ErrorResponseService,private ipSetting: IpSettingService,
               private router:Router){
  }

  ngOnInit() {
    this.pages = [];
    this.search = new GroupProduct();
    this.globalCatalogService.setTitle("员工服务/员工团购网/商品订购");
    this.getProductShowList();
    this.getNoticeList();

  }

  autoRun(){
    let $this = $("#banner-list");
    let scrollTimer;
    $this.hover(function() {
      clearInterval(scrollTimer);
    }, function() {
      scrollTimer = setInterval(function() {
        scrollNews($this);
      }, 2000);
    }).trigger("mouseleave");

    function scrollNews(obj) {
      let $self = obj.find("ul");
      let lineHeight = $self.find("li:first").height();
      $self.animate({
        "marginTop": -lineHeight + "px"
      }, 600, function() {
        $self.css({
          marginTop: 0
        }).find("li:first").appendTo($self);
      })
    }
  }

  /*获取商品列表*/
  getProductShowList(){
    let url = '/mmall/group/getProductShowList/'+this.pageNo+'/'+this.pageSize;
    this.ipSetting.sendPost(url,this.search)
      .subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.groupProducts = data.data.infos;
        // console.log(this.groupProducts);
        this.cartsize = data.data.cartsize;
        this.total = data.data.total;
      }
    });
  }
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    this.getProductShowList();
  }
  /*获取公告列表*/
  getNoticeList() {
    this.groupNoticeService.getNoticeList(this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.groupNotices = data.data.infos;
        if(this.groupNotices.length>5){
          this.autoRun();
        }
      }
    });
  }
  addToCart(id: number){
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


  viewNotice(id){
    this.groupNoticeService.getNotice(id).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.groupNotice = data.data;
        // console.log(this.groupNotice);
      }
    });
    $('.mask').show();
  }

  closeMask() {
    $('.mask').hide();
  }
}
