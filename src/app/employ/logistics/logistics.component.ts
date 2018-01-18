import { Component, OnInit } from '@angular/core';
import { GlobalCatalogService } from '../../service/global-catalog/global-catalog.service';
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {Router,ActivatedRoute} from "@angular/router";
@Component({
  selector: 'app-logistics',
  templateUrl: './logistics.component.html',
  styleUrls: ['./logistics.component.css']
})
export class LogisticsComponent implements OnInit {

  public rule;
  public catas;
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private errorVoid: ErrorResponseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.rule = this.globalCatalogService.getRole("employ/logistics");
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("员工服务/后勤服务区");
    if(this.rule){this.getRule(this.rule.ID);}
  }

  getRule(id){
    this.globalCatalogService.getCata(id,'logistics','')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.catas = data.data;
          if(this.router.url === '/hzportal/employ/logistics'){
            this.router.navigate([this.catas[0].routeUrl],{relativeTo:this.route});
          }
        }
      })
  }
}
