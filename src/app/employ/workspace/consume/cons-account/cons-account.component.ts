import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {WorkspaceMydeskService} from "../../../../service/workspace-mydesk/workspace-mydesk.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {ConsumeService} from "../../../../mode/consume/consume.service";
@Component({
  selector: 'app-cons-account',
  templateUrl: './cons-account.component.html',
  styleUrls: ['./cons-account.component.css'],
  providers: [WorkspaceMydeskService]
})
export class ConsAccountComponent implements OnInit {

  public pageNo      : number = 1;
  public pageSize    : number = 10;
  public total       : number  = 0;
  public balance     : number;
  public queryType   : string;
  public consumes    : Array<ConsumeService>;
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService: ErrorResponseService,
    private workspaceMydeskService:WorkspaceMydeskService,
  ) {

  }

  ngOnInit() {
    this.globalCatalogService.setTitle("员工服务/我的工作台/消费账户流水");
    this.balance = 0;
    this.queryType = "消费记录";
    this.consumes = [];
    this.getBalance();
    this.getConsumeInfo(1);
  }
  /*获取用户总资产*/
  getBalance(){
    this.workspaceMydeskService.getBalance()
      .subscribe((data) => {
        if(this.errorResponseService.errorMsg(data)){
          for(let i = 0;i<data.data.length;i++){
            if(data.data[i].key === '消费账户'){
              this.balance = data.data[i].value;
            }
          }
        }
      })
  }
  /*获取消费记录信息*/
  getConsumeInfo(pageNo: number) {
    this.pageNo = pageNo;
    this.workspaceMydeskService.getUserConsumeList("cost", this.pageNo, this.pageSize)
      .subscribe(data => {
        if(this.errorResponseService.errorMsg(data)){
          this.consumes = data.data.infos;
          this.total = data.data.total;
        }
      });
  }
  /*获取消费账户充值*/
  getUserRechargeList(pageNo: number) {
    this.pageNo = pageNo;
    this.workspaceMydeskService.getUserRechargeList(this.pageNo, this.pageSize)
      .subscribe(data => {
        if(this.errorResponseService.errorMsg(data)){
          this.consumes = data.data.infos;
          this.total = data.data.total;
        }
      });
  }
  changeQueryType(pageNo){
    if(this.queryType === "消费记录"){
      this.getConsumeInfo(pageNo);
    }else{
      this.getUserRechargeList(pageNo);
    }
  }
}
