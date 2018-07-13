import { Component, OnInit } from '@angular/core';
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-study-list',
  templateUrl: './study-list.component.html',
  styleUrls: ['./study-list.component.css'],
  providers:[UtilBuildingService],
})
export class StudyListComponent implements OnInit {
  public newCard = new CardInfo();
  public buildings:Array<any>;
  public pageSize = 15;
  public pageNo = 1;
  public total = 0;
  public length = 10;
  public searchInfo = new CardInfo();
  public record:Array<CardInfo>;
  public repairDept = [];
  private contractBool = true;
  constructor(
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
    private utilBuildingService:UtilBuildingService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("党建管理/学“习”时间");
    this.getRepairDept();
    this.record = [];
    this.searchInfo.createUserId = localStorage.getItem("username");
    this.searchInfo.branchName = '';
    this.searchInfo.type = '9';
    this.repairSearch(1);

  }
  /*查询*/
  repairSearch(num){
    let url = '/party/report/getList/'+num+'/'+this.pageSize;
    this.ipSetting.sendPost(url,this.searchInfo).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.record = data.data.list;
        this.total = data.data.total;
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
  /*点击编辑*/
  editCardInfo(inner){
    this.contractBool = false;
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('编辑心得体会');
    this.newCard = JSON.parse(JSON.stringify(inner));
    this.newCard.fileName = [];
    this.newCard.filePath = [];
    if(this.newCard.fileContract){
      for(let i=0;i<this.newCard.fileContract.length;i++){
        this.newCard.fileName.push(this.newCard.fileContract[i].fileName);
        this.newCard.filePath.push(this.newCard.fileContract[i].filePath);
      }
    }
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
  /*点击新增*/
  addVehicle(){
    this.contractBool = true;
    this.newCard = new CardInfo();
    this.newCard.branchName = '';
    this.newCard.type = '9';
    this.newCard.fileName = [];
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('新增心得体会');
  }
  /*新增校验*/
  public verifybranchName(){
    if (!this.isEmpty('newBranchName', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyTheme(){
    if (!this.isEmpty('theme', '不能为空')) {
      return false;
    }
    if(this.newCard.theme.length>50){
      this.addErrorClass("theme", "最大输入50个字符");
      return false;
    }
    return true;
  }
  public verifypioneerNum(){
    if (!this.isEmpty('pioneerNum', '不能为空')) {
      return false;
    }
    return true;
  }
  /*合同上传*/
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
    let url;
    if(this.contractBool === false){
      url = "/party/update/updateStudyTime";
    }else{
      url = "/party/add/addStudyTime";
    }
    if (!this.verifybranchName()||!this.verifyTheme()||!this.verifypioneerNum()) {
      return false;
    }
    let postData = JSON.parse(JSON.stringify(this.newCard));
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
        'mes': '请上传文件内容！',
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
  branchAttach:string;
  type:string; // 会议类型(三会一课同级)
  subType:string; // 子类型
  theme:string; // 会议主题
  fileName=[];
  filePath=[];
  fileContract:any;
  typicalMethod:string; // 篇数
  createUserId: string;
}

