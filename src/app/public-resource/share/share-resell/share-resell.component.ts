import { Component, OnInit } from '@angular/core';
import {ShareProduct} from "../../../mode/shareProduct/share-product.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {ShareProductPublicService} from "../../../service/share-product-public/share-product-public.service";
declare var confirmFunc:any;
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import {ActivatedRoute, Params} from "@angular/router";
@Component({
  selector: 'app-share-resell',
  templateUrl: './share-resell.component.html',
  styleUrls: ['./share-resell.component.css']
})
export class ShareResellComponent implements OnInit {
  public pageNo : number;
  public pageSize = 10;
  public total = 0;
  public search :ShareProduct;
  public shareProducts: Array<ShareProduct>;
  public nameList : Array<ShareProduct>;
  constructor(
    private route: ActivatedRoute,
    private errorResponseService:ErrorResponseService,
    private shareProductPublicService: ShareProductPublicService,
  ) { }

  ngOnInit() {
    this.shareProducts = [];
    this.search = new ShareProduct();
    this.nameList = [];
    this.getProductSelect();
    if(typeof (this.route.params['_value']['id']) === "undefined"){
      delete this.search.id;
      this.getResellProductList(1);
    }else{
      let tempid: number = 0;
      this.route.params
        .switchMap((params: Params) => this.search.id = params['id'])
        .subscribe(() => {
          if (tempid === 0) {
            this.getResellProductList(1);
            tempid++;
          }
        });
    }
  }
  /*获取当前用户转卖的商品*/
  getResellProductList(pageNo){
    this.pageNo = pageNo;
    this.shareProductPublicService.getResellProductList(this.search,this.pageNo,this.pageSize)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.shareProducts = data.data.infos;
          this.total = data.data.total;
        }
      })
  }
  getProductSelect(){
    this.shareProductPublicService.getProductSelect()
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.nameList = data.data;
        }
      })
  }
}
