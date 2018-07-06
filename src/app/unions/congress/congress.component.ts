import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {Router} from "@angular/router";
declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-congress',
  templateUrl: './congress.component.html',
  styleUrls: ['./congress.component.css'],
})
export class CongressComponent implements OnInit {
  public rule;
  public catas;
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private errorVoid: ErrorResponseService,
    private router   : Router,
  ) {

    this.rule = this.globalCatalogService.getRole("unions/congress/");
  }

  ngOnInit() {
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("unions/congress/");
        this.getRule(this.rule.ID);
      }
    );
    if(this.rule){this.getRule(this.rule.ID);}
    let url = this.router.url.trim().split('/');
    if(url[url.length-2] === 'info'||url[url.length-1] === 'list'){

      $('.row .row-title:first-child').addClass('active');
    }
  }
  getRule(id){
    this.globalCatalogService.getCata(id,'unions','unions/congress/')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.catas = data.data;

          /*for(let i = 0;i<this.catas.length;i++){
            this.catas[i].routeUrl = this.catas[i].routeUrl.slice(16);
            console.log(this.catas[i].routeUrl);
          }*/
        }
      })
  }
}
