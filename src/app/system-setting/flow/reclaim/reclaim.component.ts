import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-reclaim',
  templateUrl: './reclaim.component.html',
  styleUrls: ['./reclaim.component.css']
})
export class ReclaimComponent implements OnInit {

  public rule : any;
  constructor(
    private globalCatalogService:GlobalCatalogService,) {
    this.rule = this.globalCatalogService.getRole("system/flow");
  }

  ngOnInit() {
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("system/flow");
        // this.getQuan();
      }
    );
  }

}
