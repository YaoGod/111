import { Component, OnInit } from '@angular/core';
import { GlobalCatalogService } from '../../service/global-catalog/global-catalog.service';
@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css'],
})
export class BasicInfoComponent implements OnInit {
  constructor(
    private globalCatalogService: GlobalCatalogService
  ) { }
  ngOnInit() {
    this.globalCatalogService.setTitle("大楼管理/大楼基础信息");
  }
}
