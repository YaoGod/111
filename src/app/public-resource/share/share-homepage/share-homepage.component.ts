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
  constructor(
    private shareProductPublicService: ShareProductPublicService,
    private errorResponseService:ErrorResponseService,
  ) { }

  ngOnInit() {
    this.shareProducts = [];
    this.search = new ShareProduct();
    this.getProductList(1);
  }
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
}
