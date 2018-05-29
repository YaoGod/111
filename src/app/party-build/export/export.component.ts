import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css'],
  providers: []
})
export class ExportComponent implements OnInit {

  constructor(
    private globalCatalogService:GlobalCatalogService,
    ) { }

  ngOnInit() {
    // this.globalCatalogService.setTitle("党建管理/工作报表管理");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        // this.rule = this.globalCatalogService.getRole("security/basic");
      }
    );
  }

}
