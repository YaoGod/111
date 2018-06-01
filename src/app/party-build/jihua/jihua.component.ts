import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-jihua',
  templateUrl: './jihua.component.html',
  styleUrls: ['./jihua.component.css']
})
export class JihuaComponent implements OnInit {

  constructor(
  private globalCatalogService:GlobalCatalogService
  ) {}

  ngOnInit() {
    this.globalCatalogService.setTitle("党建管理/计划总结");
  }

}
