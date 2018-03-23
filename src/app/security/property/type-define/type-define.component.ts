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

  public dossiers   : Array<TypeDefine> = new Array<TypeDefine>();
  public newDossier : TypeDefine = new TypeDefine();
  public search     : any = "";
  public pageNo     : number = 1;
  public pageSize   : number = 9;
  public total      : number = 0;
  public rule       : sndCatalog = new sndCatalog();
  constructor(
    private globalCatalogService:GlobalCatalogService,
    private dossierBuildingService : DossierBuildingService,
    private errorResponseService : ErrorResponseService
  ) {
    this.rule = this.globalCatalogService.getRole("security/property");
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("后勤物业/物业档案管理/类型管理");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("security/property");
      }
    );
    this.getList(1);
  }
  /*获取档案类型列表*/
  getList(pageNo) {
    this.pageNo = pageNo;
    this.dossierBuildingService.getDossierList(this.search,this.pageNo,this.pageSize)
      .subscribe( data => {
        if(this.errorResponseService.errorMsg(data)) {
          this.dossiers = data.data.infos;
          this.total =data.data.total;
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
              this.closeNewView();
              this.getList(1);
            },
            'cancel': ()=> {
              this.closeNewView();
              this.getList(1);
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
              this.closeNewView();
              this.getList(1);
            },
            'cancel': () => {
              this.closeNewView();
              this.getList(1);
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
                    this.getList(1);
                  },
                  'cancel': ()=> {
                    this.getList(1);
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
