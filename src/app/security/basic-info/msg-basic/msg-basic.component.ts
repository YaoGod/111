import { Component, OnInit } from '@angular/core';
import {Building} from '../../../mode/building/building.service';
import { InfoBuildingService } from '../../../service/info-building/info-building.service';
import { UtilBuildingService } from '../../../service/util-building/util-building.service';
import { GlobalBuildingService } from '../../../service/global-building/global-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { GlobalCatalogService } from '../../../service/global-catalog/global-catalog.service';
import { sndCatalog } from '../../../mode/catalog/catalog.service';
import * as $ from 'jquery';
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
declare var confirmFunc: any;
declare var $: any;
@Component({
  selector: 'app-msg-basic',
  templateUrl: './msg-basic.component.html',
  styleUrls: ['./msg-basic.component.css'],
  providers: [Building, InfoBuildingService, UtilBuildingService,sndCatalog],
})

export class MsgBasicComponent implements OnInit {
  public building     : Building = new Building();   /*大楼信息*/
  public copyBuilding : Building = new Building(); /*大楼信息浅层拷贝*/
  public editStatus   : Boolean  = false;
  public isViewImg    : boolean = true;
  public imgWidth     : number = 500;
  public rule : sndCatalog = new sndCatalog();
  constructor(
    private globalCatalogService:GlobalCatalogService,
    private infoBuildingService:InfoBuildingService,
    private utilBuildingService:UtilBuildingService,
    private globalBuilding:GlobalBuildingService,
    private errorVoid:ErrorResponseService,
    public ipSetting  : IpSettingService
  ) {
    this.building = globalBuilding.getVal();
    this.rule = this.globalCatalogService.getRole("security/basic");
  }
  ngOnInit() {
    /*大楼信息更新订阅*/
    this.globalBuilding.valueUpdated.subscribe(
      (val) =>{
        this.building = this.globalBuilding.getVal();
      }
    );
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("security/basic");
      }
    );
  }
  /*进入编辑*/
  initEdit(){
    $('.ipt').fadeIn(700);
    $('.word').hide();
    $('.box-option').slideDown(600);
    $('.upload-option').fadeIn(600);
    this.editStatus = true;
    this.copyBuilding = JSON.parse(JSON.stringify(this.building));
  }
  /*切换图片编辑状态*/
  clickImg(){
    $('#prese').trigger('click');
  }
  /*取消操作*/
  closeEdit(){
    this.editStatus = false;
    $("#prese").val("");
    $('.ipt').hide();
    $('.word').fadeIn(700);
    $('.box-option').hide();
    $('.upload-option').slideUp(500);
  }
  /*表单提交*/
  submit(){
    this.infoBuildingService.updateBuilding(this.copyBuilding)
      .subscribe( data => {
        if(this.errorVoid.errorMsg(data)){
          confirmFunc.init({
            'title': '提示',
            'mes': data.msg,
            'popType': 2,
            'imgType': 1,
            "callback": () => {
              if(data.msg === '更新成功') {
                this.building = JSON.parse(JSON.stringify(this.copyBuilding));
                this.building.imgPath = $('#view').attr("src");
                this.globalBuilding.setVal(this.building);
                $("#prese").val("");
                this.closeEdit();
              }
            }
          });
        }
      });
  }
  /*文件上传*/
  prese_upload(files){
    var xhr = this.utilBuildingService.uploadImg(files[0],'building',this.building.id);
      xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          this.copyBuilding.imgPath = data.msg;
        }
      }else if(xhr.readyState === 4 && xhr.status === 413 ){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '图片大小超出限制',
          'popType': 1 ,
          'imgType': 2 ,
        });
      }
    };
  }
  /*查看图片*/
  viewImg(){
    this.isViewImg = false;
  }
  closeViewImg(){
    this.isViewImg = true;
  }
  /*放大图片*/
  addImg(){
    if(this.imgWidth<1000){
      this.imgWidth += 50;
    }
  }
  /*缩小图片*/
  decsImg(){
    if(this.imgWidth>500){
      this.imgWidth -= 50;
    }
  }
  /*字数限制*/
  limitText(value,limit) {
    if(value.length > limit) {
      return value.substr(0,limit);
    }
    return value;
  }
}
