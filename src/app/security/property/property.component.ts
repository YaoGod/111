import { Component, OnInit } from '@angular/core';
import { GlobalCatalogService } from '../../service/global-catalog/global-catalog.service';
@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {

  constructor(
    private globalCatalogService: GlobalCatalogService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("大楼管理/物业档案管理");
  }
}
