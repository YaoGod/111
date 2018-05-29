import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-export-detail',
  templateUrl: './export-detail.component.html',
  styleUrls: ['./export-detail.component.css']
})
export class ExportDetailComponent implements OnInit {

  constructor(
    private globalCatalogService:GlobalCatalogService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("党建管理/工作详情");
  }

}
