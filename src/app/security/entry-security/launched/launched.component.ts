import { Component, OnInit } from '@angular/core';
import {EntryService} from "../../../service/entry-security/entry-security.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";

@Component({
  selector: 'app-launched',
  templateUrl: './launched.component.html',
  styleUrls: ['./launched.component.css']
})
export class LaunchedComponent implements OnInit {

  public search :EntryService;
  public pageNo: number;
  public pageSize: number;
  public total: number;
  public orderList: Array<EntryService>;
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService,
  ) { }

  ngOnInit() {
    this.pageNo = 1;
    this.pageSize = 10;
    this.total = 0;
    this.search = new EntryService();
    this.orderList = [];
  }

  getMyExamine(pageNo){
    this.pageNo = pageNo;
  }
  edit(order){

  }

}
