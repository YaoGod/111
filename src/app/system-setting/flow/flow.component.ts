import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.css']
})
export class FlowComponent implements OnInit {

  public rule;
  public list: Array<any>;
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private router:Router,
    private route:ActivatedRoute
  ) {
    this.rule = this.globalCatalogService.getRole("system/flow");
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("系统管理/工作流配置");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("system/flow");
        this.getRule(this.rule.ID);
      }
    );
    if(this.rule){this.getRule(this.rule.ID);}
  }
  getRule(id){
    this.globalCatalogService.getCata(id,"system","")
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.list = data.data;
          // this.router.navigate(["../../../../" + this.list[0].routeUrl], {relativeTo: this.route});
          if(this.list&&this.list.length>0) {
            let url = this.router.url.split('/');
            if(url[url.length-1] === 'groupConfig') {
              this.router.navigate(["/hzportal/system/flow/groupConfig"]);
            }else if(url[url.length-1] === 'flowConfig') {
              this.router.navigate(["/hzportal/system/flow/flowConfig"]);
            }else if(url[url.length-1] === 'jobMang') {
              this.router.navigate(["/hzportal/system/flow/jobMang"]);
            }else if(url[url.length-1] === 'reclaim') {
              this.router.navigate(["/hzportal/system/flow/reclaim"]);
            }else if(url[url.length-1] === 'flow') {
              this.router.navigate(["/hzportal/"+this.list[0].routeUrl]);
            }else{
              this.router.navigate([url[url.length-1]]);
            }
          }
        }
      });
  }

}
