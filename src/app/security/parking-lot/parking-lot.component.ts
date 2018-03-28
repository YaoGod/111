import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Catalog, sndCatalog} from "../../mode/catalog/catalog.service";

@Component({
  selector: 'app-parking-lot',
  templateUrl: './parking-lot.component.html',
  styleUrls: ['./parking-lot.component.css']
})
export class ParkingLotComponent implements OnInit {
  public rule: sndCatalog = new sndCatalog();
  public catas;
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private errorVoid: ErrorResponseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("后勤物业/车位管理");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("security/parking");
        this.getRule(this.rule.ID);
      }
    );
    if(!this.rule){this.getRule(this.rule.ID);}
  }
  getRule(id){
    this.globalCatalogService.getCata(id,'parking','')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.catas = data.data;
          if(this.catas&&this.catas.length>0){
            let url = this.router.url.split('/');
            if(url[url.length-1] === 'parking'){
              this.router.navigate([this.catas[0].routeUrl],{relativeTo:this.route});
            }else{
              this.router.navigate([url[url.length-1]],{relativeTo:this.route});
            }

          }
        }
      })
  }

}
