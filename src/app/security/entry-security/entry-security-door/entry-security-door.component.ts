import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-entry-security-door',
  templateUrl: './entry-security-door.component.html',
  styleUrls: ['./entry-security-door.component.css']
})
export class EntrySecurityDoorComponent implements OnInit {

  constructor(
    private globalCatalogService: GlobalCatalogService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("后勤物业/出入安全管理/门禁管理");
  }
}
