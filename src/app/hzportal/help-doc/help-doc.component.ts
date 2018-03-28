import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-help-doc',
  templateUrl: './help-doc.component.html',
  styleUrls: ['./help-doc.component.css']
})
export class HelpDocComponent implements OnInit {

  constructor(
    private globalCatalogService: GlobalCatalogService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("操作手册");
  }

}
