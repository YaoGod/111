import { Component, OnInit } from '@angular/core';
import {ShareProduct} from "../../../mode/shareProduct/share-product.service";

@Component({
  selector: 'app-share-mypush',
  templateUrl: './share-mypush.component.html',
  styleUrls: ['./share-mypush.component.css']
})
export class ShareMypushComponent implements OnInit {

  public pageNo = 1;
  public pageSize = 10;
  public total = 0;
  public search ;
  public shareProducts: Array<ShareProduct>;
  constructor() { }

  ngOnInit() {
    this.shareProducts = [];
  }

  getShareProductsPersonl(pageNo){
    this.pageNo = pageNo;

  }
  delete(id){

  }

}
