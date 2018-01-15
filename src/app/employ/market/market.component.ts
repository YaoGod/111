import { Component, OnInit } from '@angular/core';
import { GlobalCatalogService } from '../../service/global-catalog/global-catalog.service';
@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  public rule;
  public ruleList;
  constructor(
    private globalCatalogService: GlobalCatalogService,
  ) {
    this.rule = this.globalCatalogService.getRole("employ/market");
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("员工服务/餐饮超市区");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("employ/market");
      }
    );
  }
}
