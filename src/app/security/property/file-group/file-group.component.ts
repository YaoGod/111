import { Component, OnInit } from '@angular/core';
import { Dossier } from '../../../mode/dossier/dossier.service';
import { ErrorResponseService } from "../../../service/error-response/error-response.service";
import { DossierBuildingService } from '../../../service/dossier-building/dossier-building.service';
import { UtilBuildingService } from '../../../service/util-building/util-building.service';
import { Router,ActivatedRoute} from '@angular/router';
import { GlobalCatalogService } from '../../../service/global-catalog/global-catalog.service';
import { sndCatalog } from '../../../mode/catalog/catalog.service';
declare var $:any;
declare var confirmFunc: any;
@Component({
  selector: 'app-file-group',
  templateUrl: './file-group.component.html',
  styleUrls: ['./file-group.component.css'],
  providers: [Dossier,DossierBuildingService,ErrorResponseService,UtilBuildingService,sndCatalog]
})
export class FileGroupComponent implements OnInit {

  public dossiers   : Array<Dossier>;
  public newDossier : Dossier;
  public buildings  : any;
  public classes    : any;
  public pageNo     : number;
  public pageSize   : number;
  public pages      : Array<number>;
  public search     : any;
  public rule       : sndCatalog = new sndCatalog();
  constructor(
    private globalCatalogService:GlobalCatalogService,
    private router:Router,
    private route:ActivatedRoute,
    private dossierBuildingService:DossierBuildingService,
    private errorResponseService:ErrorResponseService,
    private utilBuildingService:UtilBuildingService,
  ) {
    this.rule = this.globalCatalogService.getRole("security/property");
  }

  ngOnInit() {
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("security/property");
        console.log(this.rule);
      }
    );
    this.pageSize = 10;
    this.search = {
      buildingId : "0",
      classId    : "0",
      text       : ""
    };
    this.dossiers = new Array<Dossier>();
    this.newDossier = new Dossier();
    this.pages = new Array<number>();
    this.getDossierClass();
    this.getBuildingList();
    this.route.params.subscribe(data => {
      this.pageNo = 1;
      this.search.classId  = data.classID;
      this.search.buildingId = data.buildingID;
      this.getList();
    });
  }
  /*获取大楼名称列表*/
  getBuildingList() {
    this.utilBuildingService.getBuildingList()
      .subscribe(data => {
        if(this.errorResponseService.errorMsg(data)) {
          this.buildings = data.data;
        }
      })
  }
  /*获取大楼类别列表*/
  getDossierClass() {
    this.dossierBuildingService.getDossierClass()
      .subscribe(data => {
        if(this.errorResponseService.errorMsg(data)) {
          this.classes = data.data;
        }
      })
  }
  /*获取物业档案列表*/
  getList() {
    this.dossierBuildingService.getStandingBookInfoList(this.search,this.pageNo,this.pageSize)
      .subscribe(data => {
        if(this.errorResponseService.errorMsg(data)) {
          this.dossiers = data.data.infos;
          let total = Math.ceil(data.data.total / this.pageSize);
          this.initPage(total);
        }
      })
  }
  /*下载文件*/
  download(url){
    window.open("proxy/" + url);
  }
  /*新增方法*/
  add() {
    this.dossierBuildingService.addStandingBook(this.newDossier)
      .subscribe(data => {
        if(this.errorResponseService.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示',
            'mes': data.msg,
            'popType': 2,
            'imgType': 1,
            'callback': () => {
              this.pageNo = 1;
              this.closeNewView();
              this.getList();
            }
          });
        }
      })
  }
  /*删除群组内容*/
  delete(id) {
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除？',
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        this.dossierBuildingService.deleteStandingBook(id)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
                'callback': () => {
                  this.pageNo = 1;
                  this.getList();
                }
              });
            }
          })
      }
    });
  }
  /*页码初始化*/
  initPage(total) {
    this.pages = new Array(total);
    for(let i = 0;i< total;i++){
      this.pages[i] = i+1;
    }
  }
  /*页面显示区间5页*/
  pageLimit(page:number){
    if(this.pages.length < 5){
      return false;
    } else if(page<=5 && this.pageNo <= 3){
      return false;
    } else if(page>=this.pages.length -4 && this.pageNo>=this.pages.length-2){
      return false;
    } else if (page<=this.pageNo+2 && page>=this.pageNo-2){
      return false;
    }
    return true;
  }
  /*跳页加载数据*/
  goPage(page:number) {
    this.pageNo = page;
    this.getList();
  }
  /*编辑更新方法*/
  update() {
    this.dossierBuildingService.updateStandingBook(this.newDossier)
      .subscribe(data => {
        if(this.errorResponseService.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示',
            'mes': data.msg,
            'popType': 2,
            'imgType': 1,
            'callback': () => {
              this.pageNo = 1;
              this.closeNewView();
              this.getList();
            }
          });
        }
      })
  }
  /*表单提交*/
  submit() {
    this.verifyEmpty(this.newDossier.buildingId,'buildingNum');
    this.verifyEmpty(this.newDossier.buildingId,'buildingName');
    this.verifyEmpty(this.newDossier.classId,'className');
    this.verifyEmpty(this.newDossier.bookName,'bookName');
    this.verifyFileNone(this.newDossier.filePath, 'newImgPath');
    console.log(this.newDossier);
    if($('.red').length === 0) {
      if (typeof(this.newDossier.id) === "undefined" || this.newDossier.id === null) {
        this.add();
      } else {
        this.update();
      }
    }else {
      confirmFunc.init({
        'title': '提示' ,
        'mes': '表单数据填写不完全哦',
        'popType': 0 ,
        'imgType': 2 ,
      });
    }
  }
  /*文件上传*/
  prese_upload(files) {
    var xhr = this.utilBuildingService.uploadFile(files[0], 'standingbook', -1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorResponseService.errorMsg(data)){
          this.newDossier.filePath.push(data.msg);
          this.newDossier.fileName.push(files[0].name);
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
    this.newDossier.fileName.splice(index,1);
    this.newDossier.filePath.splice(index,1);
  }
  /*添加窗口弹出*/
  addNew() {
    /* this.getBuildingList();
     this.getDossierClass();*/
    this.newDossier = new Dossier();
    this.newDossier.buildingId = "";
    this.newDossier.classId = "";
    this.newDossier.filePath = [];
    this.newDossier.fileName = [];
    this.newDossier.buildingId = this.search.buildingId;
    this.newDossier.classId = this.search.classId;
    $('.mask').css('display','block');
  }
  /*添加窗口关闭*/
  closeNewView() {
    $('.form-control').removeClass('red');
    $('.dropify-wrapper').removeClass('red');
    $('.error').fadeOut();
    $('.mask').css('display', 'none');
  }
  /*点击编辑按钮初始化编辑*/
  editInit(data) {
    this.addNew();
    this.newDossier = JSON.parse(JSON.stringify(data));
    this.newDossier.buildingId = this.search.buildingId;
    this.newDossier.classId = this.search.classId;
    console.log(this.newDossier);
  }
  /*文件是否为空*/
  verifyFileNone(value, id) {
    console.log(value);
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
  /*判断是否为空*/
  verifyEmpty( value, id){
    console.log(value);
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
  /*字数限制*/
  limitText(value,id,limit) {
    console.log(value.length);
    if(value.length > limit) {
      this.addErrorClass(id,'超出限制，最大'+limit+'个字符');
      return value.substr(0,limit);
    }
    return value;
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
