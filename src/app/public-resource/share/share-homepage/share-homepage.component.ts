import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {ShareProductPublicService} from "../../../service/share-product-public/share-product-public.service";
import {ShareProduct} from "../../../mode/shareProduct/share-product.service";

@Component({
  selector: 'app-share-homepage',
  templateUrl: './share-homepage.component.html',
  styleUrls: ['./share-homepage.component.css']
})
export class ShareHomepageComponent implements OnInit {

  public pageNo;
  public pageSize = 6;
  public total = 0;
  public search:ShareProduct;
  public shareProducts:Array<ShareProduct>;
  public tips : Array<any>;
  constructor(
    private shareProductPublicService: ShareProductPublicService,
    private errorResponseService:ErrorResponseService,
  ) { }

  ngOnInit() {
    this.shareProducts = [];
    this.tips = [{'NUM':0},{'NUM':0},{'NUM':0},{'NUM':0},{'isAdmin':false}];
    this.search = new ShareProduct();
    this.getItemNum();
    this.getProductList(1);
  }
  /*获取可预订商品列表*/
  getProductList(pageNo){
    this.pageNo = pageNo;
    this.shareProductPublicService.getShowProductList(this.search,this.pageNo,this.pageSize)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.shareProducts = data.data.infos;
          this.total = data.data.total;
        }
      })
  }
  /*获取提示数字*/
  getItemNum(){
    this.shareProductPublicService.getItemNum()
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.tips = data.data;
        }
      })
  }
}
