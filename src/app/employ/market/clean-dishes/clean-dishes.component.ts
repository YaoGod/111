import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-clean-dishes',
  templateUrl: './clean-dishes.component.html',
  styleUrls: ['./clean-dishes.component.css']
})
export class CleanDishesComponent implements OnInit {

  constructor(
    private globalCatalogService: GlobalCatalogService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("员工服务/净菜订购区");
  }

}
