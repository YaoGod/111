import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-public-resource',
  templateUrl: './public-resource.component.html',
  styleUrls: ['./public-resource.component.css']
})
export class PublicResourceComponent implements OnInit {

  constructor(
    private globalCatalogService: GlobalCatalogService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("公共资源");
  }

}
