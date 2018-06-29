import { Component, OnInit } from '@angular/core';
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {sndCatalog} from "../../../mode/catalog/catalog.service";
import {Http} from "@angular/http";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";

declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers:[UtilBuildingService,sndCatalog],
})
export class ListComponent implements OnInit {
  public newCard = new SearchInfo();
  public buildings:Array<any>;
  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  public length = 10;
  public searchInfo = new SearchInfo();
  public record:any;
  private contractBool = true;
  public repairDept=[];
  public rule : sndCatalog = new sndCatalog();
  constructor(
    public http:Http,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
    private utilBuildingService:UtilBuildingService,
  ) {
    this.rule = this.globalCatalogService.getRole("party/upload");
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("工会管理/职代会");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("party/upload");
      }
    );
    this.searchInfo.type = "";
    this.repairSearch(1);
  }
  /*查询*/
  repairSearch(num){
    this.pageNo = num;
    let url = '/soclaty/flow/getSoclatyFlowList/'+this.pageNo+'/'+this.pageSize;
    this.ipSetting.sendPost(url,this.searchInfo).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.record = data.data.infos;
        this.total = data.data.total;
      }
    });
  }

  /*确定立案*/
  editCardInfo(){
    this.contractBool = false;
    $('.form-add').attr('disabled',false);
    $('.mask').fadeIn();
   /* this.newCard = JSON.parse(JSON.stringify(this.record[index]));
    this.newCard.fileName = [];
    this.newCard.filePath = [];
    if(this.newCard.fileContract){
      for(let i=0;i<this.newCard.fileContract.length;i++){
        this.newCard.fileName.push(this.newCard.fileContract[i].fileName);
        this.newCard.filePath.push(this.newCard.fileContract[i].filePath);
      }
    }*/
  }
  /*附件上传*/
  prese_upload(files) {
    var xhr = this.utilBuildingService.uploadFileReport(files[0],'partyBuild',-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          this.newCard.fileName.push(files[0].name);
          this.newCard.filePath.push(data.data);

          confirmFunc.init({
            'title': '提示' ,
            'mes': '上传成功',
            'popType': 0 ,
            'imgType': 1,
          });
          $('#prese').val('');
        }
      }else if (xhr.readyState === 4 && xhr.status === 413){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '文件太大',
          'popType': 0 ,
          'imgType': 2,
        });
        $('#prese').val('');
      }
    };
  }
  /*删除合同文件*/
  delFile(index) {
    this.newCard.filePath.splice(index,1);
    this.newCard.fileName.splice(index,1);
  }
  submit(){
    var url;
    if(this.contractBool === false){
      url = "/party/update/updateThreeOne";
    }else{
      url = "/party/add/addThreeOne";
    }
    let postData = JSON.parse(JSON.stringify(this.newCard));
    postData.month = this.newCard.beginTime.substring(0, 7);
    /*this.getNowFormatDate(); 018-06-09T10:00*/
    /*postData.beginTime = postData.beginTime.replace("T"," ");*/
    if(postData.filePath && postData.filePath.length>0){
      this.ipSetting.sendPost(url, postData).subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          confirmFunc.init({
            'title': '提示' ,
            'mes': this.contractBool === false?'更新成功':'新增成功',
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.repairSearch(1);
          this.addCancel();
        }
      });
    }else{
      confirmFunc.init({
        'title': '提示' ,
        'mes': '请上传附件内容！',
        'popType': 0 ,
        'imgType': 2,
      });
      return false;
    }

  }
  /*取消*/
  addCancel(){
    $('.mask,.mask1,.mask2').fadeOut();
    $('.errorMessage').html('');
  }
  private getNowFormatDate() {
    let date = new Date();
    let seperator1 = "-";
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    let num = String(month);
    if (month >= 1 && month <= 9) {
      num = "0" + month;
    }
    /*if (strDate >= 0 && strDate <= 9) {
     strDate = "0" + strDate;
     }*/
    let currentdate = date.getFullYear() + seperator1 + num;
    return currentdate;
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
  /** 添加错误信息class */
  public  addErrorClass(id: string, error?: string)  {
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
export class SearchInfo {
  id: number; // 本条信息ID
  name:string;
  theme: string;
  type:string;
  status: string;
  isFound: string;
  beginTime:string; // 开始时间
  endTime:string; // 结束时间
  createUserName: string;
  createUserDept: string;
  createTime: string;
  fileName=[];
  filePath=[];
  fileContract:any;
}

