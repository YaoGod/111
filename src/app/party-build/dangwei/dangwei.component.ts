import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-dangwei',
  templateUrl: './dangwei.component.html',
  styleUrls: ['./dangwei.component.css']
})
export class DangweiComponent implements OnInit {

  constructor(
    private globalCatalogService:GlobalCatalogService
  ) {}

  ngOnInit() {
    this.globalCatalogService.setTitle("党建管理/党委调研");
  }

}
