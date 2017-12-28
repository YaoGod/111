import { Component, OnInit } from '@angular/core';
import { GlobalCatalogService } from '../../service/global-catalog/global-catalog.service';
import {Catalog} from "../../mode/catalog/catalog.service";
@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {

  public navs : Array<Catalog>;

  constructor(
    private globalCatalogService: GlobalCatalogService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("员工服务/我的工作台");
  }

}
