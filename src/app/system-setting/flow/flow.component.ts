import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.css']
})
export class FlowComponent implements OnInit {

  constructor(
    private globalCatalogService: GlobalCatalogService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("系统管理/工作流配置");
  }

}
