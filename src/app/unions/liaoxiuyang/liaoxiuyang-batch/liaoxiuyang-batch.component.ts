import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
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
  constructor(
    public http:Http,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("工会管理/疗休养/批次管理");
    this.searchInfo = new Batch();
    this.batches = new Array<Batch>(0);
    this.newBatch = new Batch();
    this.newBatch.place  = [];
    this.lines = [];
    this.getLines();
    this.batchSearch(1);
  }
  getLines(){
    let url = "/soclaty/tourline/getTourLineSelect";
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        this.lines = data.data;
      }
    });
  }
  batchSearch(num){
    this.pageNo = num;
    let url = '/soclaty/tourbatch/getTourBatchList/'+this.pageNo+'/'+this.pageSize;
    this.ipSetting.sendPost(url,this.searchInfo).subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        this.batches = data.data.infos;
        this.total = data.data.total;
      }
    });
  }
  addNewBatch(){
    this.newBatch = new Batch();
    this.newBatch.lineId = "";
    this.newBatch.deptId = "私有";
    this.newBatch.place  = [{name:""}];
    $('#pici').fadeIn();
  }
  editBatch(batch){
    this.addNewBatch();
    this.newBatch = JSON.parse(JSON.stringify(batch));
    let tempPlace = [];
    for(let i = 0;i<this.newBatch.place.length;i++){
      tempPlace.push({name:this.newBatch.place[i]});
    }
    this.newBatch.place = tempPlace;
  }
  delBatch(id){
    confirmFunc.init({
      'title': '提示' ,
      'mes': "是否删除该批次？",
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        let url = "/soclaty/tourbatch/deleteTourBatch/"+id;
        this.ipSetting.sendGet(url).subscribe(data => {
          if(this.errorVoid.errorMsg(data)){
            confirmFunc.init({
              'title': '提示' ,
              'mes': data.msg,
              'popType': 0 ,
              'imgType': 1 ,
            });
            this.batchSearch(1);
          }
        });
      }
    });
  }
  /*取消*/
  addCancel(){
    $('.mask').fadeOut();
    $('.errorMessage').html('');
  }
  submit(){
    if(!this.verifyEmpty('newLineId')){
      return false;
    }
    if(!this.verifyEmpty('newGoTime')){
      return false;
    }
    if(!this.verifyEmpty('newBeginTime')){
      return false;
    }
    if(!this.verifyEmpty('newEndTime')){
      return false;
    }
    let verityData;
    let tempPlaceArray = [];
    for(let i = 0;i<this.newBatch.place.length;i++){
      verityData =  this.newBatch.place[i].name;
      if(verityData === ""&&verityData.toString().trim() === ''){
        this.addErrorClass("newPlace", "第"+(i+1)+"条的出团地点为空");
        return false;
      }else{
        tempPlaceArray.push(verityData.toString().trim());
        this.removeErrorClass("newPlace");
      }
    }
    let url;
    if(this.newBatch.id){
      url = "/soclaty/tourbatch/updateTourBatch";
    }else {
      url = "/soclaty/tourbatch/addTourBatch";
    }
    let postData  = JSON.parse(JSON.stringify(this.newBatch));
    postData.place = tempPlaceArray;
    tempPlaceArray = null;
    this.ipSetting.sendPost(url, postData)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          confirmFunc.init({
            'title': '提示' ,
            'mes': data.msg,
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.batchSearch(1);
          this.addCancel();
        }
      });
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
  addPlace(index){
    this.newBatch.place.splice(index+1,0,{name:""});
  }
  delPlace(index){
    this.newBatch.place.splice(index,1);
  }
}

export class Batch {
  id: string;
  code: string;
  name: string;
  lineId: any;
  lineName: string;
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
  place: Array<any>;
  status: string;
}
