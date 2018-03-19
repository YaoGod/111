import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-share-homepage',
  templateUrl: './share-homepage.component.html',
  styleUrls: ['./share-homepage.component.css']
})
export class ShareHomepageComponent implements OnInit {

  public search;
  public shareProducts;
  constructor() { }

  ngOnInit() {
    this.shareProducts = [];
  }
  getProductList(pageNo){

  }
}
