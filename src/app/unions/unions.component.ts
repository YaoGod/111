import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-unions',
  templateUrl: './unions.component.html',
  styleUrls: ['./unions.component.css']
})
export class UnionsComponent implements OnInit {

  constructor(
    private globalCatalogService: GlobalCatalogService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("工会管理");
  }

}
