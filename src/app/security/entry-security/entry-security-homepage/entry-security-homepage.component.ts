import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {Router} from "@angular/router";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";

@Component({
  selector: 'app-entry-security-homepage',
  templateUrl: './entry-security-homepage.component.html',
  styleUrls: ['./entry-security-homepage.component.css']
})
export class EntrySecurityHomepageComponent implements OnInit {
  public rule;
  public list: Array<any>;
  public routeArr=[];
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private router:Router,
  ) {
    this.rule = this.globalCatalogService.getRole("security/entrySecurity");
  }

  ngOnInit() {
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("security/entrySecurity");
        this.getRule(this.rule.ID);
      }
    );
    if(this.rule){this.getRule(this.rule.ID);}
  }
  getRule(id){
    this.globalCatalogService.getCata(id,"entrySecurity","security/entrySecurity/door")
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.list = data.data;
          // this.router.navigate(["../../../../" + this.list[0].routeUrl], {relativeTo: this.route});
          if(this.list&&this.list.length>0) {
            /*let url = this.router.url.split('/');*/
            for(let i=0;i<this.list.length;i++){
              let abc = this.list[i].routeUrl.split('/');
              for(let j=0;j<abc.length;j++){
                if(abc[j]==='door'){
                  this.routeArr.push(abc[abc.length-1]);
                }
              }
            }
            // console.log(this.routeArr);
            /*if(url[url.length-1] === 'entrySecurity') {
             this.router.navigate(["/hzportal/"+this.list[0].routeUrl]);
             }else{
             this.router.navigate(["/hzportal/"+this.list[0].routeUrl]);
             }*/
          }
        }
      });
  }

}
