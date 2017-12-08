import { Component, OnInit } from '@angular/core';
import { GlobalCatalogService } from '../../../service/global-catalog/global-catalog.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(
    private globalCatalogService: GlobalCatalogService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("员工服务/团购管理/购物车");
  }

}
