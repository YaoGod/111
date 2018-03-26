import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-system-setting',
  templateUrl: './system-setting.component.html',
  styleUrls: ['./system-setting.component.css']
})
export class SystemSettingComponent implements OnInit {

  constructor(
    private globalCatalogService: GlobalCatalogService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("系统管理");
  }

}
