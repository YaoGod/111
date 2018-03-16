import { Component, OnInit } from '@angular/core';
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {InfoBuildingService} from "../../../../service/info-building/info-building.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {Http} from "@angular/http";
import {UtilBuildingService} from "../../../../service/util-building/util-building.service";
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";

declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css'],
  providers: [InfoBuildingService,ErrorResponseService]
})
export class MasterComponent implements OnInit {
  public searchArch : string = '';
  public record: Array<GuardName>;
  public repairname: GuardName;
  public rule : any;
  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public serverName:any;
  constructor(private http: Http,
              private errorVoid:ErrorResponseService,
              private utilBuildingService:UtilBuildingService,
              private globalCatalogService:GlobalCatalogService,
              public ipSetting  : IpSettingService) { }

  ngOnInit() {
    this.getRule();
    this.repairname = new GuardName();
    this.pages = [];
    // this.serverName = ['保洁服务','报修服务','借用服务','节假日停车'];
    this.getRecord(this.searchArch, this.pageNo, this.pageSize);
  }
  /*权限*/
  getRule(){
    this.globalCatalogService.getCata(-1,'logistics','employ/logistics/property')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.rule = data.data[0];
        }
      })
  }
  /*点击查询*/
  repairSearch(num) {
    this.getRecord(this.searchArch, num, this.pageSize);
  }
  /*获取服务内容*/
  getRecord(info,pageNo,pageSize){
    let url = "/employee/property/getAllServer/" + pageNo + "/" + pageSize;
    let postData = {
      'searchArch': info
    };
    this.ipSetting.sendPost(url, postData).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.serverName = data['data']
      }
    });
  }
  /*点击新增*/
  addCompany() {
    this.repairname = new GuardName();
    $('.mask').fadeIn();
    $('.mask-head p').html('新增物业服务');
  }
  /*新增和编辑界面的取消按钮*/
  recordCancel() {
    this.repairname = new GuardName();
    $('.errorMessage').html('');
    $('.mask').hide();
  }

  /*打开反馈信息*/
  /*openFeedback(){
    this.copyWelfare.feedBack = "是";
    $('#feedbackModal').show();
  }*/
  /*关闭反馈弹窗*/
  /*closeFeedback(){
    let error = 0;
    let j= 0;
    this.copyWelfare.feedBackMsg = [];
    for (let i = 0; i < this.tempFeedbackMsg.length; i++) {
      if(this.tempFeedbackMsg[i].key === ""){
        this.tempFeedbackMsg[i].isShow = false;
      }
      if (this.tempFeedbackMsg[i].isShow &&this.tempFeedbackMsg[i].key!==""){
        if(this.tempFeedbackMsg[i].type==="下拉框"&&this.tempFeedbackMsg[i].list === ""){

          error ++;
          confirmFunc.init({
            'title': '提示',
            'mes': '请填写'+this.tempFeedbackMsg[i].key+'的枚举值（用|隔开）',
            'popType': 0,
            'imgType': 2,
          });
          break;
        }else{
          this.copyWelfare.feedBackMsg[j] = new Other();
          this.copyWelfare.feedBackMsg[j].key = this.tempFeedbackMsg[i].key;
          this.copyWelfare.feedBackMsg[j].type = this.tempFeedbackMsg[i].type;
          this.copyWelfare.feedBackMsg[j].list = this.tempFeedbackMsg[i].list;
          this.copyWelfare.feedBackMsg[j].msg = this.tempFeedbackMsg[i].msg;
          j++;
        }
      }
    }
    if(this.copyWelfare.feedBackMsg.length===0&&error===0) {
      error++;
      confirmFunc.init({
        'title': '提示',
        'mes': '请填写需反馈信息！',
        'popType': 0,
        'imgType': 2,
      });
    }
    if(error===0){
      $('#feedbackModal').fadeOut();
    }
  }*/
  public verifyservername() {
    if (!this.isEmpty('servername', '不能为空')) {
      return false;
    }
    return true;
  }
  /*新增提交*/
  recordSubmit() {
    let url = "/employee/property/addServer";
    console.log(this.repairname.isChild);
    if(this.repairname.isChild===undefined||this.repairname.number===undefined){
      confirmFunc.init({
        'title': '提示' ,
        'mes': '请把信息填写完整！',
        'popType': 0 ,
        'imgType': 2 ,
      });
    }
    if (!this.verifyservername()||this.repairname.isChild===undefined) {
      return false;
    }
    let postData = JSON.parse(JSON.stringify(this.repairname));
    this.ipSetting.sendPost(url, postData).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示' ,
          'mes': '新增成功',
          'popType': 0 ,
          'imgType': 1 ,
        });
        this.getRecord(this.searchArch, this.pageNo, this.pageSize);
        this.recordCancel();
      }
    });
  }
  /**非空校验*/
  public isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if(data === null){
      this.addErrorClass(id, error);
      return false;
    }else{
      if (data.toString().trim() === '')  {
        this.addErrorClass(id, error);
        return false;
      }else {
        this.removeErrorClass(id);
        return true;
      }
    }
  }
  /** 添加错误信息class   */
  public  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-control').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('span').html('输入错误');
    }else {
      $('#' + id).next('span').html(error);
    }
  }
  /** 去除错误信息class */
  public  removeErrorClass(id: string) {
    $('#' + id).parents('.form-control').removeClass('form-error');
    $('#' + id).parents('.form-control').children('.form-inp').children('.errorMessage').html('');
  }
}
export class GuardName {
  id: number; // 本条信息ID
  name: string;// 服务内容
  isChild:string; // 是否有具体服务项目
  detail:string; // 服务详情
  number:string; // 数量
  note:string; // 备注

}
