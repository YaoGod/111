import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-export-report',
  templateUrl: './export-report.component.html',
  styleUrls: ['./export-report.component.css']
})
export class ExportReportComponent implements OnInit {

  public pageNo:number;
  public pageSize:number;
  public total: number;
  public list: Array<any>;
  public search: Report;
  constructor(
    private globalCatalogService:GlobalCatalogService,
  ) { }

  ngOnInit() {
    this.pageNo = 1;
    this.pageSize = 10;
    this.list = [];
    this.list[0] = {};
    this.list[0].id = 0;
    this.globalCatalogService.setTitle("党建管理/工作报表管理");
    this.search = new Report();
    this.search.type = "";
  }
  getDataList(pageNo){

  }
}

export class Report{
  type: string;
}
