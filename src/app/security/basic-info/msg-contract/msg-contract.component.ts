import { Component, OnInit } from '@angular/core';
import { UtilBuildingService } from '../../../service/util-building/util-building.service';
import { ContractBuildingService } from '../../../service/contract-building/contract-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { GlobalBuildingService } from '../../../service/global-building/global-building.service';
import { InfoBuildingService } from '../../../service/info-building/info-building.service';
import { Building } from '../../../mode/building/building.service';
import { Contract } from '../../../mode/contract/contract.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
declare var confirmFunc: any;
import * as $ from 'jquery';
declare var $:any;
@Component({
  selector: 'app-msg-contract',
  templateUrl: './msg-contract.component.html',
  styleUrls: ['./msg-contract.component.css'],
  providers: [ ContractBuildingService, InfoBuildingService,UtilBuildingService ]
})
export class MsgContractComponent implements OnInit {

  public building: Building;
  public modeBuilding: Building;
  public contracts: Array<Contract>;
  public tempContract: Contract;
  private pageNo: number = 1;
  private pageSize: number = 5;
  public pages: Array<number>;
  public pageStatus: number = 2;
  private temp: any = '';
  private type = '';
  /*{0：无合同，非多合同；
     1：有一份合同，非多合同；
     2：无合同，多合同；
     3：有一份合同，多合同；
     }*/
  public watchType : boolean = true;
  public title = "";
  constructor(
    private infoBuildingService:InfoBuildingService,
    private contractBuildingService:ContractBuildingService,
    private utilBuildingService:UtilBuildingService,
    private globalBuilding:GlobalBuildingService,
    private errorVoid:ErrorResponseService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.building = globalBuilding.getVal();
  }
  ngOnInit() {
    this.building = new Building();
    this.contracts = [];
    this.pages = [];
    this.tempContract = new Contract;
    /*大楼信息更新订阅*/
    this.globalBuilding.valueUpdated.subscribe(
      (val) =>{
        this.modeBuilding = this.globalBuilding.getVal();
        this.building.name = this.modeBuilding.name;
      }
    );
    this.building.id = Number(this.router.url.split('/')[5]);
    this.route.params // 通过注入的方式拿到route里的参数params
      .switchMap((params: Params) => this.building.type = params['type'])
      .subscribe(() => {
        if(this.building.type !== this.temp) {
          this.temp = JSON.parse(JSON.stringify(this.building.type));
          this.getContract();
        }
      });

  }
  getContract() {
    this.watchType = true;
    this.contractBuildingService.getContractInfo(this.building.id, this.building.type)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          this.contracts = [];
          this.contracts[0] = data.data;
          if(typeof (this.contracts[0].id) === "undefined" || this.contracts[0].id === null){
            this.pageStatus = 0;
            this.title = "新增";
          }else {
            this.pageStatus = 1;
            this.title = "编辑";
          }
        }
      });
    this.getBuildingInfo(this.building.id);
  }
  /*获取历史合同*/
  getContractList(){
    this.watchType = false;
    this.pageStatus = 2;
    this.contractBuildingService.getContractList(
      Number(this.router.url.split('/')[5]),this.building.type,this.pageNo,this.pageSize)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.contracts = data.data.infos;
          this.pageStatus = this.contracts.length>0?3:2;
          let total = Math.ceil(data.data.total / this.pageSize);
          this.initPage(total);
        }
      });
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
    var xhr = this.utilBuildingService.uploadFile(files[0], this.building.type+'Contract', -1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          this.tempContract.filePath.push(data.msg);
          this.tempContract.fileName.push(files[0].name);
        }
      }else if(xhr.readyState === 4 && xhr.status === 413 ){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '文件大小超出限制',
          'popType': 0 ,
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
    this.verifyFileNone(this.tempContract.filePath, 'newImgPath');
    this.verifyEmpty(this.tempContract.salesName,'salesName');
    this.verifyEmpty(this.tempContract.buyName,'buyName');
    this.verifyEmpty(this.tempContract.buyContacts,'buyContacts');
    this.verifyEmpty(this.tempContract.buyContacts,'buyPhone');
    this.verifyEmpty(this.tempContract.buyCost,'buyCost');
    this.verifyEmpty(this.tempContract.buyDate,'buyDate');
    this.verifyEmpty(this.tempContract.area,'area');
    this.verifyEmpty(this.tempContract.unitPrice,'unitPrice');
    this.verifyEmpty(this.tempContract.design,'design');
    this.verifyEmpty(this.tempContract.build,'build');
    this.verifyEmpty(this.tempContract.supervise,'supervise');
    this.verifyEmpty(this.tempContract.buildDate,'buildDate');
    this.verifyEmpty(this.tempContract.payDate,'payDate');
    this.verifyEmpty(this.tempContract.buildCost,'buildCost');
    this.verifyEmpty(this.tempContract.landlord,'landlord');
    this.verifyEmpty(this.tempContract.lContacts,'lContacts');
    this.verifyEmpty(this.tempContract.lPhone,'lPhone');
    this.verifyEmpty(this.tempContract.lMail,'lMail');
    this.verifyEmpty(this.tempContract.cmccName,'cmccName');
    this.verifyEmpty(this.tempContract.cmccContacts,'cmccContacts');
    this.verifyEmpty(this.tempContract.cmccPhone,'cmccPhone');
    this.verifyEmpty(this.tempContract.name,'name');
    this.verifyEmpty(this.tempContract.contacts,'contacts');
    this.verifyEmpty(this.tempContract.phone,'phone');
    this.verifyEmpty(this.tempContract.mail,'mail');
    this.verifyEmpty(this.tempContract.contractBtime,'contractBtime');
    this.verifyEmpty(this.tempContract.contractEtime,'contractEtime');
    if (this.building.type ===  'lease' || this.building.type === 'property'){
      if(this.tempContract.contractBtime > this.tempContract.contractEtime){
        this.addErrorClass('contractEtime', '结束时间不能早于开始时间');
      }
    }
    if($('.red').length === 0) {
      let data =  JSON.parse(JSON.stringify(this.tempContract));
      data.buyDate = this.formatDate(this.tempContract.buyDate);
      data.buildDate = this.formatDate(this.tempContract.buildDate);
      data.payDate = this.formatDate(this.tempContract.payDate);
      data.contractBtime = this.formatDate(this.tempContract.contractBtime);
      data.contractEtime = this.formatDate(this.tempContract.contractEtime);
      if(typeof (data.id) === "undefined" || data.id === null) {
        this.addContract(data);
      }else {
        this.updateContract(data);
      }
    }else {
      confirmFunc.init({
        'title': '提示' ,
        'mes': '表单数据填写不完全',
        'popType': 2 ,
        'imgType': 2 ,
      });
    }
  }
  /*获取大楼信息*/
  getBuildingInfo(id:number){
    this.infoBuildingService.getBuildingMsg(id)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.modeBuilding = data.data.buildingInfo;
          if(this.modeBuilding.imgPath !== null) {
            this.modeBuilding.imgList = this.modeBuilding.imgPath.split(',');
          }
          if(typeof (data.data.attachInfo) !== 'undefined' && data.data.attachInfo !== null){
            this.modeBuilding.buildDept = data.data.attachInfo.buildDept;
            this.modeBuilding.buildTime = data.data.attachInfo.buildTime;
            this.modeBuilding.payTime = data.data.attachInfo.payTime;
          }
          this.globalBuilding.setVal(this.modeBuilding);
        }
      });
  }
  /*新增*/
  addContract(json:any){
    this.contractBuildingService.addContract(json,this.building.type)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': data.msg,
            'popType': 2 ,
            'imgType': 1 ,
            "callback": () => {
              $("#fileUpload").val("");
              this.pageNo = 1;
              this.closeNewView();
              this.getContract();
            }
          });
        }
      })
  }
  /*更新*/
  updateContract(json:any) {
    this.contractBuildingService.updateContract(json,this.building.type)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': data.msg,
            'popType': 2 ,
            'imgType': 1 ,
            "callback": () => {
              $("#fileUpload").val("");
              this.pageNo = 1;
              this.closeNewView();
              this.getContract();
            }
          });
        }
      })
  }
  verifyFileNone(value, id) {
    if(typeof (value) === "undefined" ||
      value === null ||
      value === ''){
        this.addErrorClass(id,'请上传附件');
      return false;
    }else{
      if(value.length === 0){
        this.addErrorClass(id,'请上传附件');
        return false;
      }
      this.removeErrorClass(id);
      return true;
    }
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
  /*时间格式转换*/
  formatDate( value ) {
    if( typeof (value) === "undefined" || value === null || value === ''){
      return null;
    }else {
      return value.replace(/-/g,'/');
    }
  }
  formatDateforDatePicker( value ) {
    if( typeof (value) === "undefined" || value === null || value === ''){
      return null;
    }else {
      return value.replace(/\//g,'-');
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
  initEdit(i) {
    this.addNewRoom();
    this.tempContract = JSON.parse(JSON.stringify(this.contracts[i]));
    this.tempContract.buyDate = this.formatDateforDatePicker(this.tempContract.buyDate);
    this.tempContract.buildDate =  this.formatDateforDatePicker(this.tempContract.buildDate);
    this.tempContract.payDate =  this.formatDateforDatePicker(this.tempContract.payDate);
    this.tempContract.contractBtime =  this.formatDateforDatePicker(this.tempContract.contractBtime);
    this.tempContract.contractEtime = this.formatDateforDatePicker(this.tempContract.contractEtime);
  }
  deleteContract(id) {
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      "callback": () => {
        this.contractBuildingService.deleteContract(id,this.building.type)
          .subscribe(data => {
            if (this.errorVoid.errorMsg(data)) {
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
  /*页码初始化*/
  initPage(total){
    this.pages = new Array(total);
    for(let i = 0;i< total ;i++){
      this.pages[i] = i+1;
    }
  }
  /*页面显示区间5页*/
  pageLimit(page:number){
    console.log(page);
    if(this.pages.length < 5){
      return false;
    } else if(page<=5 && this.pageNo <= 3){
      return false;
    } else if(page>=this.pages.length -4 && this.pageNo>=this.pages.length-2){
      return false;
    } else if (page<=this                                                                                                                                                                 .pageNo+2 && page>=this.pageNo-2){
      return false;
    }
    return true;
  }
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    this.getContractList();
  }
  openFile(url) {
    window.open("proxy"+ url);
  }
}
