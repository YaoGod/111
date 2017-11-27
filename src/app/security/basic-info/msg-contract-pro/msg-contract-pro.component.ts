import { Component, OnInit } from '@angular/core';
import { ContractBuildingService } from '../../../service/contract-building/contract-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { Contract } from '../../../mode/contract/contract.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-msg-contract-pro',
  templateUrl: './msg-contract-pro.component.html',
  styleUrls: ['./msg-contract-pro.component.css'],
  providers: [ ContractBuildingService ]
})
export class MsgContractProComponent implements OnInit {

  public contracts: Array<Contract>;
  private pageNo: number = 1;
  private pageSize: number = 5;
  public search:any;
  constructor(
    private contractBuildingService:ContractBuildingService,
    private errorVoid:ErrorResponseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.contracts = new Array<Contract>(1);
    this.contracts[0] = new Contract;
    this.getContract();
  }
  /*获取当前合同*/
  getContract(){
    this.contractBuildingService.getContractInfo(
      Number(this.router.url.split('/')[5]),'property')
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          this.contracts = new Array<Contract>(1);
          this.contracts[0] = new Contract;
          this.contracts[0] = data.data;
        }
      });
  }
  /*获取历史合同*/
  getContractList(){
    this.contractBuildingService.getContractList(
      Number(this.router.url.split('/')[5]),'property',this.pageNo,this.pageSize)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          this.contracts = data.data;
        }
      });
  }
}
