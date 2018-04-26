import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-entry-security-homepage',
  templateUrl: './entry-security-homepage.component.html',
  styleUrls: ['./entry-security-homepage.component.css']
})
export class EntrySecurityHomepageComponent implements OnInit {

  constructor(
    private globalCatalogService: GlobalCatalogService,) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("后勤物业/出入安全管理");
  }

}
