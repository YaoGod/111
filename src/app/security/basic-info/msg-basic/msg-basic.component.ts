import { Component, OnInit } from '@angular/core';
import {Building} from '../../../mode/building/building.service';
import { InfoBuildingService } from '../../../service/info-building/info-building.service';
import { UtilBuildingService } from '../../../service/util-building/util-building.service';
import { GlobalBuildingService } from '../../../service/global-building/global-building.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import * as $ from 'jquery';
declare var $:any;
@Component({
  selector: 'app-msg-basic',
  templateUrl: './msg-basic.component.html',
  styleUrls: ['./msg-basic.component.css'],
  providers: [Building,InfoBuildingService,UtilBuildingService],
})

export class MsgBasicComponent implements OnInit {
  public building     : Building = new Building;   /*大楼信息*/
  public copyBuilding : Building = new Building(); /*大楼信息浅层拷贝*/
  public editStatus   : Boolean  = false;
  constructor(
    private infoBuildingService:InfoBuildingService,
    private utilBuildingService:UtilBuildingService,
    private globalBuilding:GlobalBuildingService,
    private errorVoid:ErrorResponseService
  ) {
    this.building = globalBuilding.getVal();
  }
  ngOnInit() {
    /*大楼信息更新订阅*/
    this.globalBuilding.valueUpdated.subscribe(
      (val) =>{
        this.building = this.globalBuilding.getVal();
      }
    );
  }
  /*进入编辑*/
  initEdit(){
    $('.ipt').css('display','inline-block');
    $('.word').css('display','none');
    $('.box-option').css('display','block');
    this.editStatus = true;
    this.copyBuilding = JSON.parse(JSON.stringify(this.building));
  }
  /*切换图片编辑状态*/
  clickImg(){
    if(this.editStatus){
      $('#file_upload').trigger('click');
    }else{
      // 查看图片大图
    }

  }
  /*取消操作*/
  closeEdit(){
    $('.ipt').css('display','none');
    $('.word').css('display','inline-block');
    $('.box-option').css('display','none');
  }
  /*表单提交*/
  submit(){
    var data = this.copyBuilding;
    this.infoBuildingService.updateBuilding(data)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data.status)){
          if(data.msg === '更新成功'){
            this.building = this.copyBuilding;
            this.globalBuilding.setVal(this.building);
            this.closeEdit();
          }
          else{
            alert(data.msg);
          }
        }
      });
  }
  /*文件上传*/
  prese_upload(files){
    var xhr = this.utilBuildingService.uploadImg(files[0],'building',this.building.id);
      xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        console.log(data);
        if(this.errorVoid.errorMsg(data.status)){
          this.copyBuilding.imgPath = data.msg;
          this.copyBuilding.imgList[0] = data.msg;
        }
      }
    };
  }
}
