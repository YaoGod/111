import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DossierBuildingService } from '../../../service/dossier-building/dossier-building.service';
import { ErrorResponseService } from "../../../service/error-response/error-response.service";
import { GlobalCatalogService } from '../../../service/global-catalog/global-catalog.service';
import { sndCatalog } from '../../../mode/catalog/catalog.service';
@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css'],
  providers: [DossierBuildingService,ErrorResponseService,sndCatalog]
})
export class FrontComponent implements OnInit {

  public watchType  : boolean;
  public buildings  : any;
  public classes    : any;
  public search     : any;
  public rule : sndCatalog = new sndCatalog();
  constructor(
    private globalCatalogService:GlobalCatalogService,
    private router : Router,
    private dossierBuildingService : DossierBuildingService,
    private errorResponseService:ErrorResponseService
  ) {
    this.rule = this.globalCatalogService.getRole("security/property");
  }

  ngOnInit() {
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("security/property");
        console.log(this.rule);
      }
    );
    this.watchType = true;
    this.search = {
      buildingId : "0",
      classId    : "0"
    };
    this.getBuildingList();
    this.getDossierClass();
    console.log(this.router.url.split('/')[4]);
    this.watchType = this.router.url.split('/')[4] === 'account'? true:false;
    this.search.classId = this.router.url.split('/')[5];
    this.search.buildingId = this.router.url.split('/')[6];
  }
  /*跳转到类型列表*/
  linkType() {
    if(this.search.classId === "-1") {
      this.router.navigate(["/hzportal/security/property/type"]);
    }else{
      if(this.watchType){
        this.router.navigate(["/hzportal/security/property/account",this.search.classId,this.search.buildingId]);
      }else{
        this.router.navigate(["/hzportal/security/property/file",this.search.classId,this.search.buildingId]);
      }

    }
  }
  /*获取大楼名称列表*/
  getBuildingList() {
    this.dossierBuildingService.getBuildingList()
      .subscribe(data => {
        if(this.errorResponseService.errorMsg(data)) {
          this.buildings = data.data;
        }
      })
  }
  /*获取大楼类别列表*/
  getDossierClass() {
    this.dossierBuildingService.getDossierClass()
      .subscribe(data => {
        if(this.errorResponseService.errorMsg(data)) {
          this.classes = data.data;
        }
      })
  }
}
