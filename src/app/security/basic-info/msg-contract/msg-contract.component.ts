import { Component, OnInit } from '@angular/core';
import { ContractBuildingService } from '../../../service/contract-building/contract-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { Building } from '../../../mode/building/building.service';
import { Contract } from '../../../mode/contract/contract.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-msg-contract',
  templateUrl: './msg-contract.component.html',
  styleUrls: ['./msg-contract.component.css'],
  providers: [ ContractBuildingService ]
})
export class MsgContractComponent implements OnInit {

  public building: Building;
  public contract: Contract;
  constructor(
    private contractBuildingService:ContractBuildingService,
    private errorVoid:ErrorResponseService,
    private router: Router
  ) {}
  ngOnInit() {
    this.building = new Building();
    this.contract = new Contract();
    this.building.id = Number(this.router.url.split('/')[5]);
    this.building.type = this.router.url.split('/')[7];
    this.getContract();
  }
  getContract(){
    this.contractBuildingService.getContractInfo(this.building.id,this.building.type)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data.status)){
          this.contract = data.data;
        }
      });
  }
}
