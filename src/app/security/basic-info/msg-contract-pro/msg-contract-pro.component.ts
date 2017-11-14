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

  public contract: Contract;
  constructor(
    private contractBuildingService:ContractBuildingService,
    private errorVoid:ErrorResponseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.contract = new Contract();
    this.getContract();
  }
  getContract(){
    this.contractBuildingService.getContractInfo( Number(this.router.url.split('/')[5]),'property')
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data.status)){
          this.contract = data.data;
        }
      });
  }
}
