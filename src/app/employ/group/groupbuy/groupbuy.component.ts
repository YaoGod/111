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
import { DomSanitizer } from '@angular/platform-browser'
import { Pipe } from '@angular/core';
import {forEach} from "@angular/router/src/utils/collection";


declare var $:any;
declare var confirmFunc: any;
declare var tinymce: any;

@Component({
  selector: 'app-groupbuy',
  templateUrl: './groupbuy.component.html',
  styleUrls: ['./groupbuy.component.css'],
  providers:[GroupProductService,ErrorResponseService,GroupNoticeService]
})
@Pipe({name: 'safeHtml'})
export class GroupbuyComponent implements OnInit {
  public rule;
  public catas;
  public mangUrl = '';
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
  public imgData:any;
  public groupNotice = {
    title: '',
    notice: ''
  };
  constructor( private globalCatalogService: GlobalCatalogService,
  private groupProductService: GroupProductService,
              private groupNoticeService: GroupNoticeService,
              private errorVoid: ErrorResponseService,public ipSetting: IpSettingService,
               private router:Router,private sanitizer: DomSanitizer){
    this.rule = this.globalCatalogService.getRole("employ/group");
  }
  transform(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  ngOnInit() {
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("employ/group");
      }
    );
    this.getRule();
    this.pages = [];
    this.search = new GroupProduct();
    this.globalCatalogService.setTitle("员工服务/员工团购网");
    this.getProductShowList(1);
    this.getNoticeList();
    this.imgData = [];
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'group','employ/group')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.catas = data.data;
          for(let i = 0;i<this.catas.length;i++){
            if(this.catas[i].routeUrl === "employ/group"){
              this.catas.splice(i,1);
              i = 0;
            }
          }
          if(this.catas.length>0){
            this.mangUrl = this.catas[0].routeUrl;
          }
        }
      })
  }
  autoRun(){
    let $this = $("#banner-list");
    let scrollTimer;
    $this.hover(function() {
      clearInterval(scrollTimer);
    }, function() {
      scrollTimer = setInterval(function() {
        scrollNews($this);
      }, 1500);
    }).trigger("mouseleave");

    function scrollNews(obj) {
      let $self = obj.find("ul");
      let lineHeight = $self.find("li:first").height();
      $self.animate({
        "marginTop": -lineHeight + "px"
      }, 1000, function() {
        $self.css({
          marginTop: 0
        }).find("li:first").appendTo($self);
      })
    }
  }
  skip(id){
    this.router.navigate(['/hzportal/employ/group/info',id]);
  }
  /*获取商品列表*/
  getProductShowList(num){
    this.pageNo = num;
    let url = '/mmall/group/getProductShowList/'+this.pageNo+'/'+this.pageSize;
    this.ipSetting.sendPost(url,this.search)
      .subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.groupProducts = data.data.infos;
        this.cartsize = data.data.cartsize;
        this.total = data.data.total;
        for(let i =0; i< this.groupProducts.length; i++){
          this.sanitizer.bypassSecurityTrustUrl(this.groupProducts[i].imgPath);
        }
      }
    });
  }

  /*跳页加载数据*/
  goPage(page:number){
    this.getProductShowList(page);
  }
  /*获取公告列表*/
  getNoticeList() {
    this.search.status = '01';
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


  viewNotice(id){
    this.groupNoticeService.getNotice(id).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.groupNotice = data.data;
      }
    });
    $('.mask').show();
  }

  closeMask() {
    $('.mask').hide();
  }
}
