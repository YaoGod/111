import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import * as $ from 'jquery';

declare var confirmFunc: any;
declare var tinymce: any;
@Component({
  selector: 'app-goodsnotice',
  templateUrl: './goodsnotice.component.html',
  styleUrls: ['./goodsnotice.component.css'],
  providers: [ErrorResponseService]
})
export class GoodsnoticeComponent implements OnInit {
  public imgPrefix: string;
  public groupNotice: GoodsNotice;
  public search: GoodsNotice;
  /*搜索*/
  public groupNotices: Array<GoodsNotice>;
  /*列表*/
  private delId: any;
  public updateNotice: GoodsNotice;
  private pageNo = 1;
  /*当前页码*/
  private pageSize = 6;
  /*显示页数*/
  public newGroupNotice = {
    title: '',
    notice: '',
    status: ''
  }
  public upGroupNotice = {
    id:'',
    title: '',
    notice: '',
    status: ''
  }
  constructor(private ipSetting  : IpSettingService,private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.imgPrefix = this.ipSetting.ip;
    this.groupNotice = new GoodsNotice();
    this.search = new GoodsNotice();
    this.updateNotice = new GoodsNotice();
    this.getNoticeList();
  }

  /*获取列表*/
  getNoticeList() {
    let url = '/mmall/notice/getNoticeList';
    this.ipSetting.sendPost(url,this.search)
    .subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.groupNotices = data.data.infos;
      }
    });
  }

  fadeBom() {
    $('.mask').show();
  }

  closeMask() {
    $('.mask').hide();
    $('#prese').val('');
    this.newGroupNotice = {
      'title': '',
      'notice': '',
      'status': ''
    }
  }

  /*
   新增公告信息
   param: id:number,     #公告ID
   return:
   */
  subGroupNotice() {
    if (this.newGroupNotice.title === '' || this.newGroupNotice.notice === '' || this.newGroupNotice.status === '') {
      confirmFunc.init({
        'title': '提示',
        'mes': "请把信息填写完整",
      });
      return false;
    }
    let url = '/mmall/notice/addGroupbuyNotice';
    this.ipSetting.sendPost(url,this.newGroupNotice)
      .subscribe(data => {
        if(data['status'] === 0){
          alert("新增成功")
          /* confirmFunc.init({
           'title': '提示' ,
           'mes': '新增成功',
           });*/
          this.closeMask();
          this.getNoticeList();
        }else{
          alert("新增失败")
          this.closeMask();
          /* confirmFunc.init({
           'title': '提示' ,
           'mes': data['msg'],
           });*/
        }
      })
  }

  /*
   删除公告信息
   param: id:number,     #大楼ID
   return:
   */
  /*删除*/
  okFunc() {
    $('.confirm').hide();
    let url = '/mmall/notice/deleteGroupbuyNotice/'+this.delId;
    this.ipSetting.sendGet(url)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data.status)) {
          alert("删除成功");
        }
        this.getNoticeList();
      });
  }

  noFunc() {
    $('.confirm').fadeOut();
  }

  delete(id: number) {
    /*let d = confirm("是否删除该大楼");
     if(d){

     }*/
    this.delId = id;
    $('.confirm').fadeIn();
  }


  update(id: number) {
    let url = '/proxy/mmall/notice/getNotice/'+id;
    this.ipSetting.sendGet(url)
      .subscribe(data => {
        if(data['status']==0){
          // this.updateNotice = data.data;

          this.upGroupNotice.title = data.data.title;
          this.upGroupNotice.notice = data.data.notice;
          this.upGroupNotice.status = data.data.status;
          this.upGroupNotice.id = data.data.id;

        }
        $('.mask2').show();
      })
  }
  /*
   修改公告信息
   param: id:number,     #大楼ID
   return:
   */
  updateGroupNotice() {
    if (this.upGroupNotice.title === '' || this.upGroupNotice.notice === '' || this.upGroupNotice.status === '') {
      alert("请把信息填完整")
      return false;
    }

    let url = '/mmall/notice/updateGroupNotice';
    this.ipSetting.sendPost(url,this.upGroupNotice)
      .subscribe(data => {

        if(data['status'] === 0){
          alert("修改成功")
          /* confirmFunc.init({
           'title': '提示' ,
           'mes': '新增成功',
           });*/
          this.closeMask2();
          this.getNoticeList();
        }else{
          alert("修改失败")
          this.closeMask2();
          /* confirmFunc.init({
           'title': '提示' ,
           'mes': data['msg'],
           });*/
        }
      })
  }
  view(id: number){
    let url = '/mmall/notice/getNotice/'+id;
    this.ipSetting.sendGet(url)
      .subscribe(data => {
        if (data['status'] === 0) {
          this.updateNotice = data.data;
        }
        $('.mask3').show();
      })
  }
  closeMask2() {
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
    $('.mask3').hide();
  }

}

export class GoodsNotice {
  id:                     string; /*id*/
  notice:                string; /*通知内容*/
  status:                string; /*状态*/
  insertTime:           string; /*创建时间*/
  insertUser:           string;/*创建人*/
  updateTime:           string; /*更新时间*/
  updateUser:           string; /*更新人*/
  title:                 string; /*通知抬头*/
}
