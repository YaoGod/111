import {Component, OnInit } from '@angular/core';
import { GroupNotice } from '../../../mode/groupNotice/group-notice.service';
import { GroupNoticeService } from '../../../service/group-notice/group-notice.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import * as $ from 'jquery';
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
declare var $:any;
declare var confirmFunc: any;
declare var tinymce: any;
@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css'
  ],
  providers: [GroupNoticeService,UtilBuildingService,ErrorResponseService]
})
export class NoticeComponent implements OnInit {
  public groupNotice: GroupNotice;
  public search: GroupNotice;
  /*搜索*/
  public groupNotices: Array<GroupNotice>;
  /*列表*/
  private delId: any;
  public updateNotice: GroupNotice;
  public pages: Array<number>;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
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

  constructor(private groupNoticeService: GroupNoticeService,
              private errorVoid: ErrorResponseService,) {
  }

  ngOnInit() {
    this.groupNotice = new GroupNotice();
    this.search = new GroupNotice();
    this.pages = [];
    this.getNoticeList();
  }

  /*获取列表*/
  getNoticeList() {
    this.groupNoticeService.getNoticeList(this.search).subscribe(data => {
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

  subGroupNotice() {
    if (this.newGroupNotice.title === '' || this.newGroupNotice.notice === '' || this.newGroupNotice.status === '') {
      confirmFunc.init({
        'title': '提示',
        'mes': "请把信息填写完整",
      });
      return false;
    }
    this.groupNoticeService.addGroupBuyNotice(this.newGroupNotice)
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

  /*删除*/
  okFunc() {
    $('.confirm').hide();
    this.groupNoticeService.deleteGroupbuyNotice(this.delId)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data.status)) {
          alert("删除成功");
        }
        this.getNoticeList();
      });
  }


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
            this.getNoticeList();
          });
      }
    });
  }

  update(id: number) {
    this.groupNoticeService.getNotice(id)
      .subscribe(data => {
        if(data['status']==0){
          this.updateNotice = data.data;

          this.upGroupNotice.title = data.data.title;
          this.upGroupNotice.notice = data.data.notice;
          this.upGroupNotice.status = data.data.status;
          this.upGroupNotice.id = data.data.id;

        }
        $('.mask2').show();
      })
  }
  updateGroupNotice() {
    if (this.upGroupNotice.title === '' || this.upGroupNotice.notice === '' || this.upGroupNotice.status === '') {
      alert("请把信息填完整")
      return false;
    }

    this.groupNoticeService.updateGroupBuyNotice(this.upGroupNotice)
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
    this.groupNoticeService.getNotice(id)
      .subscribe(data => {
        if (data['status']==0) {
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
