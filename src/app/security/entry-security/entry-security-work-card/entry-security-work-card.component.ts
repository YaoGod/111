import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-entry-security-work-card',
  templateUrl: './entry-security-work-card.component.html',
  styleUrls: ['./entry-security-work-card.component.css']
})
export class EntrySecurityWorkCardComponent implements OnInit {

  constructor(
    private globalCatalogService: GlobalCatalogService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("后勤物业/出入安全管理/工号牌管理");
  }

}
