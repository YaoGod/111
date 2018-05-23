import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-entry-security',
  templateUrl: './entry-security.component.html',
  styleUrls: ['./entry-security.component.css']
})
export class EntrySecurityComponent implements OnInit {
  public rule;
  public list: Array<any>;
  constructor(
    private globalCatalogService: GlobalCatalogService,
  ) {
    this.rule = this.globalCatalogService.getRole("security/entrySecurity");

  }

  ngOnInit() {
    this.globalCatalogService.setTitle("后勤物业/出入安全管理");

  }
}
