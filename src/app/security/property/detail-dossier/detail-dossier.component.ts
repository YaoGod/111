import { Component, OnInit } from '@angular/core';
import { Dossier } from '../../../mode/dossier/dossier.service';
import { ErrorResponseService } from "../../../service/error-response/error-response.service";
import { DossierBuildingService } from '../../../service/dossier-building/dossier-building.service';
import { UtilBuildingService } from '../../../service/util-building/util-building.service';
import { Router,ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-detail-dossier',
  templateUrl: './detail-dossier.component.html',
  styleUrls: ['./detail-dossier.component.css'],
  providers: [Dossier,DossierBuildingService,ErrorResponseService,UtilBuildingService]
})
export class DetailDossierComponent implements OnInit {

  public dossier: Dossier;
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private dossierBuildingService:DossierBuildingService,
    private errorResponseService:ErrorResponseService,
    private utilBuildingService:UtilBuildingService,
  ) { }

  ngOnInit() {
    this.dossier =  new Dossier();
    this.route.params.subscribe(data => {
     this.dossier.id = data.dossierId;
     this.getDossierDetail();
    });
  }
  /*获取详情页面*/
  getDossierDetail() {
    this.dossierBuildingService.getDossierDetail(this.dossier.id)
      .subscribe(data =>{
          if(this.errorResponseService.errorMsg(data)){
            this.dossier=  data.data;
          }
      })
  }
  /*下载文件*/
  download(url){
    window.open("proxy/" + url);
  }
}
