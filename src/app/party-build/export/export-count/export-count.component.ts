import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
declare var $:any;
declare var confirmFunc:any;
@Component({
  selector: 'app-export-count',
  templateUrl: './export-count.component.html',
  styleUrls: ['./export-count.component.css']
})
export class ExportCountComponent implements OnInit {

  public pageNo:number;
  public pageSize:number;
  public total: number;
  public list: Array<any>;
  constructor(
    private globalCatalogService:GlobalCatalogService,
  ) { }

  ngOnInit() {
    this.pageNo = 1;
    this.pageSize = 10;
    this.list = [];
    this.globalCatalogService.setTitle("党建管理/统计报表管理");
  }

  getDataList(pageNo){

  }
  exportDataList(){

  }
}
