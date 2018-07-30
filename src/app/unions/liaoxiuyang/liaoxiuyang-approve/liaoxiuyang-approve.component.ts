import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-liaoxiuyang-approve',
  templateUrl: './liaoxiuyang-approve.component.html',
  styleUrls: ['./liaoxiuyang-approve.component.css']
})
export class LiaoxiuyangApproveComponent implements OnInit {

  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  public searchInfo='';
  public orders:any;
  public resultSubmit = {status:'pass',checkNote:'同意',id:''};
  constructor(
    public http:Http,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
  ) { }

  ngOnInit() {
    this.searchInfoList(1);
  }
  searchInfoList(num){
    this.pageNo = num;
    let url = '/soclaty/tourenroll/getPendingCheck/'+num+'/'+this.pageSize+'?userName='+this.searchInfo;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        this.orders = data.data.infos;
        this.total = data.data.total;
      }
    });
  }
  /*更改审批意见*/
  changeOpinion(value){
    if(value==='pass'){
      this.resultSubmit.checkNote = '同意';
    }else{
      this.resultSubmit.checkNote = '不同意';
    }
  }
/*点击审批*/
  checkPer(id){
    $('.mask').fadeIn();
    this.resultSubmit.id = id;
  }
  submit(){
    if (this.resultSubmit.status === "") {
      confirmFunc.init({
        'title': '提示' ,
        'mes': '请选择审批意见！',
        'popType': 0 ,
        'imgType': 2 ,
      });
      return false;
    }
    if (!this.verifyEmpty('userAssess')) {
      confirmFunc.init({
        'title': '提示' ,
        'mes': '请填写原因说明！',
        'popType': 0 ,
        'imgType': 2 ,
      });
      return false;
    }

    let url = "/soclaty/tourenroll/updateTourEnrollStatus";
    let postData = JSON.parse(JSON.stringify(this.resultSubmit));

    this.ipSetting.sendPost(url, postData)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          confirmFunc.init({
            'title': '提示' ,
            'mes': data.msg,
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.searchInfoList(1);
          this.addCancel();
        }
      });
  }
  /*取消*/
  addCancel(){
    $('.mask').fadeOut();
    $('.errorMessage').html('');
  }
  /*新增校验*/
  public verifyEmpty(id){
    if (!this.isEmpty(id, '不能为空')) {
      return false;
    }
    return true;
  }
  /**非空校验*/
  public isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if(typeof (data)==="undefined"|| data === null){
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
  /** 添加错误信息class */
  public  addErrorClass(id: string, error?: string){
    $('#' + id).parents('.form-inp').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('span').html('输入错误');
    }else {
      $('#' + id).next('span').html(error);
    }
  }
  /**去除错误信息class */
  public  removeErrorClass(id: string) {
    $('#' + id).parents('.form-inp').removeClass('form-error');
    $('#' + id).parents('.form-inp').children('.errorMessage').html('');
  }
}
