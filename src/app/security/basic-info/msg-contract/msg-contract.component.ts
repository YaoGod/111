import { Component, OnInit } from '@angular/core';
import { ContractBuildingService } from '../../../service/contract-building/contract-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { Building } from '../../../mode/building/building.service';
import { Contract } from '../../../mode/contract/contract.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';
declare var $:any;
@Component({
  selector: 'app-msg-contract',
  templateUrl: './msg-contract.component.html',
  styleUrls: ['./msg-contract.component.css'],
  providers: [ ContractBuildingService ]
})
export class MsgContractComponent implements OnInit {

  public building: Building;
  public contracts: Array<Contract>;
  private pageNo: number = 1;
  private pageSize: number = 5;
  constructor(
    private contractBuildingService:ContractBuildingService,
    private errorVoid:ErrorResponseService,
    private router: Router
  ) {}
  ngOnInit() {
    this.building = new Building();
    this.contracts = [];
    this.contracts[0] = new Contract;
    this.building.id = Number(this.router.url.split('/')[5]);
    this.building.type = this.router.url.split('/')[7];
    this.getContract();
  }
  getContract(){
    this.contractBuildingService.getContractInfo(this.building.id, this.building.type)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data.status)){
          this.contracts[0] = data.data;
        }
      });
  }
  /*获取历史合同*/
  getContractList(){
    this.contractBuildingService.getContractList(
      Number(this.router.url.split('/')[5]),'property',this.pageNo,this.pageSize)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data.status)){
          this.contracts = data.data;
        }
      });
  }
  verifyEmpty( value, id){
    if(typeof (value) === "undefined" ||
      value === null ||
      value === ''){
      this.addErrorClass(id,'该值不能为空');
      return false;
    }else{
      this.removeErrorClass(id);
      return true;
    }
  }
  /* 添加错误信息*/
  private addErrorClass(id: string, error: string)  {
    $('#' + id).addClass('red');
    $('#' + id).parent().next('.error').fadeIn().html(error);
  }
  /*去除错误信息*/
  private  removeErrorClass(id: string) {
    $('#' + id).removeClass('red');
    $('#' + id).parent().next('.error').fadeOut();
  }

}
