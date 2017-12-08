import { Component, OnInit } from '@angular/core';
import { TypeDefine } from '../../../mode/type-define/type-define.service';
import { DossierBuildingService } from "../../../service/dossier-building/dossier-building.service";
import { ErrorResponseService } from "../../../service/error-response/error-response.service";
import { GlobalCatalogService } from '../../../service/global-catalog/global-catalog.service';
import { sndCatalog } from '../../../mode/catalog/catalog.service';
declare var $:any;
declare var confirmFunc: any;
@Component({
  selector: 'app-type-define',
  templateUrl: './type-define.component.html',
  styleUrls: ['./type-define.component.css'],
  providers: [TypeDefine,DossierBuildingService,ErrorResponseService,sndCatalog]
})
export class TypeDefineComponent implements OnInit {

  public dossiers   : Array<TypeDefine> = new Array();
  public newDossier : TypeDefine = new TypeDefine();
  public search     : any = "";
  public pageNo     : number;
  public pageSize   : number;
  public pages      : Array<number>;
  public rule       : sndCatalog = new sndCatalog();
  constructor(
    private globalCatalogService:GlobalCatalogService,
    private dossierBuildingService : DossierBuildingService,
    private errorResponseService : ErrorResponseService
  ) {
    this.rule = this.globalCatalogService.getRole("security/property");
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("大楼管理/物业档案管理/类型管理");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("security/property");
        console.log(this.rule);
      }
    );
    this.pageNo = 1;
    this.pageSize = 9;
    this.getList();
  }
  /*获取档案类型列表*/
  getList() {
    this.dossierBuildingService.getDossierList(this.search,this.pageNo,this.pageSize)
      .subscribe( data => {
        if(this.errorResponseService.errorMsg(data)) {
          this.dossiers = data.data.infos;
          let total = Math.ceil(data.data.total / this.pageSize);
          this.initPage(total);
        }
      });
  }
  /*新增*/
  add() {
    this.dossierBuildingService.addDossier(this.newDossier)
      .subscribe(data => {
        if(this.errorResponseService.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': data.msg,
            'popType': 2 ,
            'imgType': 1 ,
            'callback': ()=> {
              this.pageNo = 1;
              this.closeNewView();
              this.getList();
            },
            'cancle': ()=> {
              this.pageNo = 1;
              this.closeNewView();
              this.getList();
            }
          });
        }
      })
  }
  /*更新*/
  update() {
    this.dossierBuildingService.updateDossier(this.newDossier)
      .subscribe(data => {
        if(this.errorResponseService.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示',
            'mes': data.msg,
            'popType': 2,
            'imgType': 1,
            'callback': () => {
              this.pageNo = 1;
              this.pageSize = 9;
              this.closeNewView();
              this.getList();
            },
            'cancle': () => {
              this.pageNo = 1;
              this.pageSize = 9;
              this.closeNewView();
              this.getList();
            }
          });
        }
      });
  }
  /*删除类型*/
  delete(id:number) {
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': ()=> {
        if (typeof(id) !== "undefined" && id != null) {
          this.dossierBuildingService.deleteDossier(id)
            .subscribe(data => {
              if(this.errorResponseService.errorMsg(data)) {
                confirmFunc.init({
                  'title': '提示' ,
                  'mes': data.msg,
                  'popType': 2 ,
                  'imgType': 1 ,
                  'callback': ()=> {
                    this.pageNo = 1;
                    this.getList();
                  },
                  'cancle': ()=> {
                    this.pageNo = 1;
                    this.getList();
                  }
                });
              }
            })
        }
      }
    });
  }
  /*点击编辑按钮初始化编辑*/
  editInit(data) {
    this.addNew();
    this.newDossier = JSON.parse(JSON.stringify(data));
  }
  /*页码初始化*/
  initPage(total){
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
  /*添加窗口弹出*/
  addNew() {
    this.newDossier = new TypeDefine();
    $('.mask').css('display','block');
  }
  /*添加窗口关闭*/
  closeNewView() {
    $('.form-control').removeClass('red');
    $('.error').fadeOut();
    $('.mask').css('display', 'none');
  }
  /*提交窗口内数据*/
  submit() {
    this.verifyEmpty(this.newDossier.num,'newNum');
    this.verifyEmpty(this.newDossier.name,'newName');
    this.verifyEmpty(this.newDossier.explain,'newExplain');
    if($('.red').length === 0) {
      if (typeof(this.newDossier.id) === "undefined" || this.newDossier.id === null) {
        this.add();
      } else {
        this.update();
      }
    }else{
      confirmFunc.init({
        'title': '提示' ,
        'mes': '表单数据填写不完全哦',
        'popType': 0 ,
        'imgType': 2 ,
      });
    }
  }
  /*判断是否为空*/
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

}
