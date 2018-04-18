import {Component, OnInit } from '@angular/core';
import { GroupNotice } from '../../../mode/groupNotice/group-notice.service';
import { GroupNoticeService } from '../../../service/group-notice/group-notice.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import * as $ from 'jquery';
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {GroupProductService} from "../../../service/group-product/group-product.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
declare var $:any;
declare var confirmFunc: any;
declare var tinymce: any;
@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css'],
  providers: [GroupNoticeService,UtilBuildingService,ErrorResponseService,GroupProductService]
})
export class NoticeComponent implements OnInit {

  public catas;
  public rule;
  public groupNotice: GroupNotice;
  public search: GroupNotice;
  /*搜索*/
  public groupNotices: Array<GroupNotice>;
  /*列表*/
  private delId: any;
  public updateNotice: GroupNotice;
  public pages: Array<number>;
  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public imgData    : any;
  public imgPathList:Array<string>;
  public imgPath:Array<string>;
  /*显示页数*/
  public newGroupNotice = {
    title: '',
    notice: '',
    status: ''
  };
  public upGroupNotice = {
    id:'',
    title: '',
    notice: '',
    status: ''
  };

  constructor(private groupNoticeService: GroupNoticeService,
              private groupProductService: GroupProductService,
              private globalCatalogService: GlobalCatalogService,
              private errorVoid: ErrorResponseService,
              public ipSetting: IpSettingService,) {
  }

  ngOnInit() {this.getRule();
    this.groupNotice = new GroupNotice();
    this.search = new GroupNotice();
    this.pages = [];
    this.getNoticeList(1);
    this.imgData = [];
    this.imgPath = [];
    this.imgPathList = [];
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'group','employ/group')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.catas = data.data;
          for(let i = 0;i<this.catas.length;i++){
            if(this.catas[i].routeUrl === "employ/group"){
              this.catas.splice(i,1);
              i = 0;
            }
            if(this.catas[i].routeUrl === "employ/group/notice"){
              this.rule = this.catas[i];
            }
          }
        }
      })
  }
  /*获取列表*/
  getNoticeList(num) {
    this.pageNo = num;
    this.groupNoticeService.getNoticeList(this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.groupNotices = data.data.infos;
        this.total = data.data.total;
      }
    });
  }

  fadeBom() {
    $('.mask').show();
  }
  fadeBanner() {

    let url = '/mmall/group/getAdvertImg';
    this.ipSetting.sendGet(url)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          $('.mask1').show();
          this.imgData = data.data;
        }
      })
  }
  closeMask() {
    $('.errorMessage').html('');
    $('.mask,.mask1,.mask2').hide();
    $('#prese').val('');
    this.newGroupNotice = {
      'title': '',
      'notice': '',
      'status': ''
    }
  }
  /*删除图片*/
  delImgPath(index){
    this.imgData.splice(index,1);
  }
  /*banner图片上传*/
  prese_upload(files){
    let xhr = this.groupProductService.uploadImg(files[0],"groupAdvert",-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        let data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          this.imgData.push({'imagePath':data.msg,'imageContent':window.URL.createObjectURL(files[0])});
        }
        $('#press').val('');
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
  /*保存图片信息*/
  subGroupPic(){
    let url = '/mmall/group/addAdvertImg';
    let arr = [];
    for(let i=0;i<this.imgData.length;i++){
      arr.push(this.imgData[i].imagePath);
    }
    if(arr.length<3){
      confirmFunc.init({
        'title': '提示',
        'mes': '请至少上传3张广告图！',
        'popType': 0,
        'imgType': 2,
      });
      return false;
    }
    this.ipSetting.sendPost(url,arr)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示',
            'mes': data['msg'],
            'popType': 0,
            'imgType': 1,
          });
          this.closeMask();
        }
      })
  }

  /*提交公告信息*/
  subGroupNotice() {
    if (this.newGroupNotice.title === '' || this.newGroupNotice.notice === '' || this.newGroupNotice.status === '') {
      confirmFunc.init({
        'title': '提示',
        'mes': '请把信息填写完整',
        'popType': 0,
        'imgType': 2,
      });
      return false;
    }
    this.groupNoticeService.addGroupBuyNotice(this.newGroupNotice)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示',
            'mes': data['msg'],
            'popType': 0,
            'imgType': 1,
          });
          this.closeMask();
          this.getNoticeList(1);
        }
      })
  }

  /*删除*/
  delete(index: number) {
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        this.groupNoticeService.deleteGroupbuyNotice(index)
          .subscribe(data => {
            if (this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data['msg'],
                'popType': 0,
                'imgType': 1,
              });
              this.pages = [];
              this.pageNo = 1;
            }
            this.getNoticeList(1);
          });
      }
    });
  }

  update(id: number) {
    this.groupNoticeService.getNotice(id)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.updateNotice = data.data;
          // console.log(data.data);
          this.upGroupNotice.title = data.data.title;
          this.upGroupNotice.notice = data.data.notice;
          this.upGroupNotice.status = data.data.status;
          this.upGroupNotice.id = data.data.id;
          $('.mask2').show();
        }
      })
  }
  updateGroupNotice() {
    if (this.upGroupNotice.title === '' || this.upGroupNotice.notice === '' || this.upGroupNotice.status === '') {
      confirmFunc.init({
        'title': '提示',
        'mes': '请把信息填完整',
        'popType': 0,
        'imgType': 2,
      });
      return false;
    }
    this.groupNoticeService.updateGroupBuyNotice(this.upGroupNotice)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          // console.log(data);
          confirmFunc.init({
            'title': '提示',
            'mes': data['msg'],
            'popType': 0,
            'imgType': 1,
          });
          this.closeMask2();
          this.getNoticeList(1);
        }
      })
  }
  view(id: number){
    this.groupNoticeService.getNotice(id)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.updateNotice = data.data;
          $('.mask3').show();
        }
      })
  }
  closeMask2() {
    $('.errorMessage').html('');
    $('.mask2').hide();
    $('#prese').val('');
    this.upGroupNotice = {
      'id':'',
      'title': '',
      'notice': '',
      'status': ''
    }
  }

  closeMask3() {
    $('.errorMessage').html('');
    $('.mask3').hide();
  }
  goPage(i){
    this.getNoticeList(i);
  }
}
