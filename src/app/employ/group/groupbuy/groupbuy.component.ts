import { Component, OnInit } from '@angular/core';
import { GroupProduct } from '../../../mode/groupProduct/group-product.service';
import { GroupProductService } from '../../../service/group-product/group-product.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import * as $ from 'jquery';
declare var $:any;
declare var confirmFunc: any;
declare var tinymce: any;
@Component({
  selector: 'app-groupbuy',
  templateUrl: './groupbuy.component.html',
  styleUrls: ['./groupbuy.component.css'],
  providers:[GroupProductService,ErrorResponseService]
})
export class GroupbuyComponent implements OnInit {
  public groupProducts: Array<GroupProduct>;
  constructor() { }

  ngOnInit() {
  }

  goCart(){

  }

}
