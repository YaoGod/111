import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-laundry',
  templateUrl: './laundry.component.html',
  styleUrls: ['./laundry.component.css']
})
export class LaundryComponent implements OnInit {

  public catas;
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private errorVoid: ErrorResponseService
  ) { }

  ngOnInit() {
    this.getRule();
  }

  getRule(){
    this.globalCatalogService.getCata(-1,'logistics','employ/logistics/laundry/')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.catas = data.data;
          console.log(data.data);
          for(let i = 0;i<this.catas.length;i++){
            if(this.catas[i].routeUrl === "employ/logistics/laundry/serveTime"){
              this.catas.splice(i,1);
              i = 0;
            }
          }
        }
      })
  }
}
