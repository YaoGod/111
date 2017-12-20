import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-daily-mag',
  templateUrl: './daily-mag.component.html',
  styleUrls: ['./daily-mag.component.css']
})
export class DailyMagComponent implements OnInit {

  constructor(
    private globalCatalogService: GlobalCatalogService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("大楼管理/大楼日常管理");
  }

}
