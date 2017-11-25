import { Component, OnInit } from '@angular/core';
import { UtilBuildingService } from '../../../service/util-building/util-building.service';
import { ContractBuildingService } from '../../../service/contract-building/contract-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { GlobalBuildingService } from '../../../service/global-building/global-building.service';
import { Building } from '../../../mode/building/building.service';
import { Contract } from '../../../mode/contract/contract.service';
import { Router } from '@angular/router';
declare var confirmFunc: any;
import * as $ from 'jquery';
import {element} from "protractor";
declare var $:any;
@Component({
  selector: 'app-msg-contract',
  templateUrl: './msg-contract.component.html',
  styleUrls: ['./msg-contract.component.css'],
  providers: [ ContractBuildingService, UtilBuildingService ]
})
export class MsgContractComponent implements OnInit {

  public building: Building;
  public contracts: Array<Contract>;
  public tempContract: Contract;
  private pageNo: number = 1;
  private pageSize: number = 5;
  public pageStatus: number = 0;
  /*{0：无合同，非多合同；
     1：有一份合同，非多合同；
     2：无合同，多合同；
     3：有一份合同，多合同；
     }*/
  public title = "";
  constructor(
    private contractBuildingService:ContractBuildingService,
    private utilBuildingService:UtilBuildingService,
    private globalBuilding:GlobalBuildingService,
    private errorVoid:ErrorResponseService,
    private router: Router
  ) {
    this.building = globalBuilding.getVal();
  }
  ngOnInit() {
    this.building = new Building();
    this.contracts = [];
    this.tempContract = new Contract;
    /*大楼信息更新订阅*/
    this.globalBuilding.valueUpdated.subscribe(
      (val) =>{
        var a  = this.globalBuilding.getVal();
        this.building.name =a.name;
      }
    );
    this.building.id = Number(this.router.url.split('/')[5]);
    this.building.type = this.router.url.split('/')[7];
    this.getContract();
  }
  getContract(){
    this.contractBuildingService.getContractInfo(this.building.id, this.building.type)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data.status)){
          this.contracts[0] = data.data;
          if(typeof (this.contracts[0].id) === "undefined" || this.contracts[0].id === null){
            this.pageStatus = 0;
            this.title = "新增";
          }else {
            this.pageStatus = 1;
            this.title = "编辑";
          }
          console.log(this.pageStatus);
        }
      });
  }
  /*获取历史合同*/
  getContractList(){
    this.contractBuildingService.getContractList(
      Number(this.router.url.split('/')[5]),'lease',this.pageNo,this.pageSize)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data.status)) {
          this.contracts = data.data;
          this.pageStatus = this.contracts.length>0?3:2;
          console.log(this.pageStatus);
        }
      });
  }
  /*折叠展示历史信息*/
  isLeaseHistory(){
    if(this.contracts.length > 0 ){
      if(typeof (this.contracts[0].id) === "undefined" ||
       this.contracts[0].id === null){
        return false;
      }
      return true;
    }
      return false;
  }
  /*添加合同窗口弹出*/
  addNewRoom() {
    this.tempContract = new Contract;
    this.tempContract.buildingId = this.building.id;
    this.tempContract.buildingName =this.building.name;
    this.tempContract.filePath = [];
    this.tempContract.fileName = [];
    $('.mask').css('display','block');
  }
  /*添加楼层窗口关闭*/
  closeNewView(){
    $('.form-control').removeClass('red');
    $('.error').fadeOut();
    $('.mask').css('display', 'none');
  }
  /*文件上传*/
  prese_upload(files) {
    console.log(files[0].name);
    var xhr = this.utilBuildingService.uploadFile(files[0], this.building.type+'Contract', -1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data.status)){
          this.tempContract.filePath.push(data.msg);
          this.tempContract.fileName.push(files[0].name);
        }
      }else if(xhr.readyState === 4 && xhr.status === 413 ){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '文件大小超出限制',
          'popType': 1 ,
          'imgType': 2 ,
        });
      }
    };
  }
  /*静态删除文件*/
  deleteFile(index) {
    this.tempContract.fileName.splice(index,1);
    this.tempContract.filePath.splice(index,1);
  }
  /*提交合同信息*/
  submit() {
    if($('.red').length === 0) {
      if(typeof (this.tempContract.id) === "undefined" || this.tempContract.id === null) {
        this.addContract();
      }else{
        this.updateContract();
      }
    }else{
      confirmFunc.init({
        'title': '提示' ,
        'mes': '表单数据填写不完全哦',
        'popType': 1 ,
        'imgType': 1 ,
      });
    }
  }
  /*新增*/
  addContract(){
    this.contractBuildingService.addContract(this.tempContract,this.building.type)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data.status)) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': data.msg,
            'popType': 2 ,
            'imgType': 1 ,
            "callback": () => {
              this.pageNo = 1;
              this.closeNewView();
              this.getContract();
            }
          });
        }
      })
  }
  /*更新*/
  updateContract() {
    this.contractBuildingService.updateContract(this.tempContract,this.building.type)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data.status)) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': data.msg,
            'popType': 2 ,
            'imgType': 1 ,
            "callback": () => {
              this.pageNo = 1;
              this.closeNewView();
              this.getContract();
            }
          });
        }
      })
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
  /*合同编辑*/
  initEdit(i){
    this.addNewRoom();
    this.tempContract = JSON.parse(JSON.stringify(this.contracts[i]));
    console.log(this.tempContract);
  }
  deleteContract(id){
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除该合同',
      'popType': 1 ,
      'imgType': 1 ,
      "callback": () => {
        this.contractBuildingService.deleteContract(id,this.building.type)
          .subscribe(data => {
            if (this.errorVoid.errorMsg(data.status)) {
              confirmFunc.init({
                'title': '提示' ,
                'mes': data.msg,
                'popType': 1 ,
                'imgType': 1 ,
                "callback": () => {
                  this.pageNo = 1;
                  this.closeNewView();
                  this.getContract();
                }
              });
            }
          })
      }
    });
  }
}
