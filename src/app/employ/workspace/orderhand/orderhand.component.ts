import { Component, OnInit } from '@angular/core';
import {WorkspaceMydeskService} from "../../../service/workspace-mydesk/workspace-mydesk.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-orderhand',
  templateUrl: './orderhand.component.html',
  styleUrls: ['./orderhand.component.css'],
  providers: [WorkspaceMydeskService]
})
export class OrderhandComponent implements OnInit {

  public typeTitle:string = "订单";
  public things      : Array<any> = [];
  constructor(
    private route:ActivatedRoute,
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService: ErrorResponseService,
    private workspaceMydeskService:WorkspaceMydeskService,
  ) {
  }
  ngOnInit() {
    this.globalCatalogService.setTitle("员工服务/我的工作台/待办事项");
    this.route.params.subscribe(data=>{
      this.typeTitle = data.type === 'DOrder'?'订单':'工单';
      this.getHandlingOrderInfo(data.type);
    });

  }
  getHandlingOrderInfo(type){
    this.workspaceMydeskService.getHandlingOrderInfo(type,'')
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
            this.things = data.data;
        }
      })
  }
}
