import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {sndCatalog} from "../../../mode/catalog/catalog.service";
declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-featurelist',
  templateUrl: './featurelist.component.html',
  styleUrls: ['./featurelist.component.css'],
  providers:[UtilBuildingService,sndCatalog],
})
export class FeaturelistComponent implements OnInit {
  public newCard = new CardInfo();
  public buildings:Array<any>;
  public pageSize = 15;
  public pageNo = 1;
  public total = 0;
  public length = 10;
  public searchInfo = new SearchInfo();
  public record:any;
  private contractBool = true;
  public repairDept=[];
  public imgInfo = [];
  public imgName = [];
  public rule : sndCatalog = new sndCatalog();
  constructor( public http:Http,
               public ipSetting:IpSettingService,
               public errorVoid:ErrorResponseService,
               private globalCatalogService:GlobalCatalogService,
               private utilBuildingService:UtilBuildingService,
  ) {
    this.rule = this.globalCatalogService.getRole("party/upload");
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("党建管理/工作台账上传");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("party/upload");
      }
    );
    this.searchInfo.type = '8';
    this.searchInfo.branchName = '';
    this.searchInfo.subType = '';
    this.searchInfo.createUserId = localStorage.getItem("username");
    this.repairSearch(1);
    this.getRepairDept();
  }
  /*查询*/
  repairSearch(num){
    let url = '/party/report/getList/'+num+'/'+this.pageSize;
    this.ipSetting.sendPost(url,this.searchInfo).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.record = data.data.list;
        this.total = data.data.total;
        for(let i = 0;i<this.record.length;i++){
          if(this.record[i].imageName){
            this.record[i].arr = this.record[i].imageName.split(',');
            this.filter_array(this.record[i].arr);
            if(this.record[i].arr.length === 0){
              this.record[i].aaa = '';
              this.record[i].bbb = '';
              this.record[i].ccc = '';
            }
            if(this.record[i].arr.length === 1){
              this.record[i].aaa = this.record[i].arr[0];
              this.record[i].bbb = '';
              this.record[i].ccc = '';
            }
            if(this.record[i].arr.length === 2){
              this.record[i].aaa = this.record[i].arr[0];
              this.record[i].bbb = this.record[i].arr[1];
              this.record[i].ccc = '';
            }
            if(this.record[i].arr.length === 3){
              this.record[i].aaa = this.record[i].arr[0];
              this.record[i].bbb = this.record[i].arr[1];
              this.record[i].ccc = this.record[i].arr[2];
            }
          }
        }
      }
    });
  }
  /*删除图片*/
  delImgPath(index){
    // this.newCard.imgPathList.splice(index,1);
    this.imgInfo.splice(index,1);
    this.imgName.splice(index,1);

    // this.newCard.imgPath.splice(index,1);
  }
  /*点击编辑*/
  editCardInfo(id){
    this.contractBool = false;
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('编辑支部特色内容');
    // this.newCard = JSON.parse(JSON.stringify(this.record[index]));
    let url = "/party/report/detail/"+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.newCard = data.data;
        if(this.newCard.fileContract){
          for(let i=0;i<this.newCard.fileContract.length;i++){
            this.imgInfo.push(this.newCard.fileContract[i].filePath);
          }
          this.imgName = this.filter_array(this.newCard.imageName.split(','));
        }
      }
    });

  }
  /*编辑获取单条数据*/
  getWelfare(id){
    let url = "/party/report/detail/"+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        console.log(data);
        this.newCard = data.data;
      }
    });

  }
  /*点击删除*/
  delCardInfo(id){
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let url = '/party/report/delete/'+id;
        this.ipSetting.sendGet(url).subscribe(data => {
          if(this.errorVoid.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示' ,
              'mes': data['msg'],
              'popType': 0 ,
              'imgType': 1 ,
            });
            this.repairSearch(1);
          }
        });
      }
    });
  }
  /*获取部门列表*/
  getRepairDept(){
    let url = '/party/report/getDeptList';
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.repairDept = data.data;
      }
    });
  };
  /*点击新增*/
  addVehicle(){
    this.contractBool = true;
    this.newCard = new CardInfo();
    this.newCard.branchName = '';
    this.newCard.type = '8';
    this.newCard.subType = '';
    this.imgInfo = [];
    this.imgName = [];
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('新增支部特色内容');
  }
  /*新增校验*/
  public verifybranchName(){
    if (!this.isEmpty('branchName', '不能为空')) {
      return false;
    }
    return true;
  }
  /*新增文件图片上传*/
  prese_upload2(files){
    let xhr = this.utilBuildingService.uploadImages(files[0],'partyBuild',-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        let data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          if(this.imgInfo&&this.imgInfo.length>2){
            confirmFunc.init({
              'title': '提示' ,
              'mes': '最多上传3张图片！',
              'popType': 0 ,
              'imgType': 2 ,
            });
            return false;
          }else{
            this.imgInfo.push(data.msg);
            this.imgName.push(files[0].name);
          }
        }
        $('#press').val('');
      }
    };
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
      url = "/party/update/updateFeature";
    }else{
      url = "/party/add/addFeature";
    }
    if (!this.verifybranchName()) {
      return false;
    }
    let postData = JSON.parse(JSON.stringify(this.newCard));
    // postData.month = this.newCard.beginTime.substring(0, 7);
    /*postData.beginTime = postData.beginTime.replace("T"," ");*/
    postData.imgPathList = [];
    postData.imageName = '';
    let array = JSON.parse(JSON.stringify(this.imgInfo));
    let arrayName = JSON.parse(JSON.stringify(this.imgName));
    // this.filter_array(array);
    // this.filter_array(arrayName);
    if(array&&array.length===0){
      confirmFunc.init({
        'title': '提示',
        'mes': '请上传图片！',
        'popType': 0,
        'imgType': 2,
      });
      return false;
    }
    for(let i=0;i<array.length;i++){
      postData.imageName += arrayName[i] + ',';
    }
    postData.imgPathList = array;
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
  }
  private filter_array(array) {
    for(var i = 0 ;i<array.length;i++) {
      if(array[i] == "" || typeof(array[i]) == "undefined") {
        array.splice(i,1);
        i= i-1;
      }
    }
    return array;
  }
  /*取消*/
  addCancel(){
    $('.mask,.mask1,.mask2').fadeOut();
    this.imgInfo = [];
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
export class CardInfo {
  id: number; // 本条信息ID
  branchName:string; // 支部名称
  branchAttach:string; // 所属党支部
  type:string; // 会议类型(三会一课同级)
  subType:string; // 子类型
  month: string;// 月份
  name:string; // 文件名称
  beginTime:string; // 开始时间
  endTime:string; // 结束时间
  host:string; // 主持人
  createUserId:string;
  recorder:string; // 记录人
  shouldNum:number; // 应到人数
  factNum:number; // 实到人数
  absentNum:number; // 缺席人数
  reason:string; // 缺席原因
  theme:string; // 会议主题
  note:string; // 会议议程
  address:string; // 会议地点
  imageName:string;
  imgPath:string;
  imgPathList = [];
  fileName=[];
  filePath=[];
  fileContract:any;
}
export class SearchInfo {
  id: number; // 本条信息ID
  branchName:string; // 支部名称
  imageName:string;
  type:string; // 会议类型(三会一课同级)
  subType:string; // 子类型
  month: string;// 月份
  name:string; // 文件名称
  createUserId:string;
  beginTime:string; // 开始时间
  endTime:string; // 结束时间
  host:string; // 主持人
  recorder:string; // 记录人
  shouldNum:number; // 应到人数
  factNum:number; // 实到人数
  absentNum:number; // 缺席人数
  reason:string; // 缺席原因
  theme:string; // 会议主题
  note:string; // 会议议程
  address:string; // 会议地点
}
