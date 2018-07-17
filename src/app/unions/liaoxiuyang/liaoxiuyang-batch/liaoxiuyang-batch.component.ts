import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-liaoxiuyang-batch',
  templateUrl: './liaoxiuyang-batch.component.html',
  styleUrls: ['./liaoxiuyang-batch.component.css']
})
export class LiaoxiuyangBatchComponent implements OnInit {

  public searchInfo : Batch;
  public batches: Array<Batch>;
  public lines: Array<any>;
  public newBatch: Batch;
  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  constructor() { }

  ngOnInit() {
    this.searchInfo = new Batch();
    this.batches = new Array<Batch>();
    this.newBatch = new Batch();
    this.lines = [
      {
        id: '千岛湖',
        name: '千岛湖五日疗休养'
      },
      {
        id: '浙中山水体验',
        name: '浙中山水体验式五日疗休养'
      },
      {
        id: '嘉兴乌镇',
        name: '嘉兴乌镇五日疗休养'
      },
    ];
  }

  batchSearch(num){
    this.pageNo = num;
  }
  addNewBatch(){
    this.newBatch = new Batch();
    $('#pici').fadeIn();
  }
  /*取消*/
  addCancel(){
    $('.mask').fadeOut();
    $('.errorMessage').html('');
  }
  submit(){

  }
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

export class Batch {
  id: string;
  code: string;
  name: string;
  lineObject: any;
  deptId: string;
  batchId: string;
  goTime: string;
  backTime:string;
  beginTime: string;
  endTime: string;
  createTime: string;
  createUserDept: string;
  createUserId: string;
  createUserName: string;
  maxNum: number;
  minNum: number;
  realNum: number;
  status: string;
}
