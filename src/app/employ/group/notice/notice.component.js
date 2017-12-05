"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var group_notice_service_1 = require("../../../mode/groupNotice/group-notice.service");
var group_notice_service_2 = require("../../../service/group-notice/group-notice.service");
var error_response_service_1 = require("../../../service/error-response/error-response.service");
var $ = require("jquery");
var util_building_service_1 = require("../../../service/util-building/util-building.service");
var NoticeComponent = (function () {
    function NoticeComponent(groupNoticeService, errorVoid) {
        this.groupNoticeService = groupNoticeService;
        this.errorVoid = errorVoid;
        this.pageNo = 1;
        /*当前页码*/
        this.pageSize = 6;
        /*显示页数*/
        this.newGroupNotice = {
            title: '',
            notice: '',
            status: ''
        };
        this.upGroupNotice = {
            id: '',
            title: '',
            notice: '',
            status: ''
        };
    }
    NoticeComponent.prototype.ngOnInit = function () {
        this.groupNotice = new group_notice_service_1.GroupNotice();
        this.getNoticeList();
        this.search = this.groupNotice.title;
    };
    /*获取大楼列表*/
    NoticeComponent.prototype.getNoticeList = function () {
        var _this = this;
        this.groupNoticeService.getNoticeList(this.search).subscribe(function (data) {
            if (_this.errorVoid.errorMsg(data.status)) {
                _this.groupNotices = data.data.infos;
            }
        });
    };
    NoticeComponent.prototype.fadeBom = function () {
        $('.mask').show();
    };
    NoticeComponent.prototype.closeMask = function () {
        $('.mask').hide();
        $('#prese').val('');
        this.newGroupNotice = {
            'title': '',
            'notice': '',
            'status': ''
        };
    };
    NoticeComponent.prototype.subGroupNotice = function () {
        var _this = this;
        if (this.newGroupNotice.title === '' || this.newGroupNotice.notice === '' || this.newGroupNotice.status === '') {
            confirmFunc.init({
                'title': '提示',
                'mes': "请把信息填写完整",
            });
            return false;
        }
        this.groupNoticeService.addGroupBuyNotice(this.newGroupNotice)
            .subscribe(function (data) {
            if (data['status'] === 0) {
                alert("新增成功");
                /* confirmFunc.init({
                 'title': '提示' ,
                 'mes': '新增成功',
                 });*/
                _this.closeMask();
                _this.getNoticeList();
            }
            else {
                alert("新增失败");
                _this.closeMask();
                /* confirmFunc.init({
                 'title': '提示' ,
                 'mes': data['msg'],
                 });*/
            }
        });
    };
    /*删除*/
    NoticeComponent.prototype.okFunc = function () {
        var _this = this;
        $('.confirm').hide();
        this.groupNoticeService.deleteGroupbuyNotice(this.delId)
            .subscribe(function (data) {
            if (_this.errorVoid.errorMsg(data.status)) {
                alert("删除成功");
            }
            _this.getNoticeList();
        });
    };
    NoticeComponent.prototype.noFunc = function () {
        $('.confirm').fadeOut();
    };
    NoticeComponent.prototype.delete = function (id) {
        /*let d = confirm("是否删除该大楼");
         if(d){
    
         }*/
        this.delId = id;
        $('.confirm').fadeIn();
    };
    NoticeComponent.prototype.update = function (id) {
        var _this = this;
        this.groupNoticeService.getNotice(id)
            .subscribe(function (data) {
            if (data['status'] == 0) {
                //this.updateNotice = data.data;
                console.log(data.data);
                _this.upGroupNotice.title = data.data.title;
                _this.upGroupNotice.notice = data.data.notice;
                _this.upGroupNotice.status = data.data.status;
                _this.upGroupNotice.id = data.data.id;
            }
            $('.mask2').show();
        });
    };
    NoticeComponent.prototype.updateGroupNotice = function () {
        var _this = this;
        if (this.upGroupNotice.title === '' || this.upGroupNotice.notice === '' || this.upGroupNotice.status === '') {
            alert("请把信息填完整");
            return false;
        }
        console.log(this.upGroupNotice);
        this.groupNoticeService.updateGroupBuyNotice(this.upGroupNotice)
            .subscribe(function (data) {
            console.log(data);
            if (data['status'] === 0) {
                alert("修改成功");
                /* confirmFunc.init({
                 'title': '提示' ,
                 'mes': '新增成功',
                 });*/
                _this.closeMask2();
                _this.getNoticeList();
            }
            else {
                alert("修改失败");
                _this.closeMask2();
                /* confirmFunc.init({
                 'title': '提示' ,
                 'mes': data['msg'],
                 });*/
            }
        });
    };
    NoticeComponent.prototype.view = function (id) {
        var _this = this;
        this.groupNoticeService.getNotice(id)
            .subscribe(function (data) {
            if (data['status'] == 0) {
                _this.updateNotice = data.data;
            }
            $('.mask3').show();
        });
    };
    NoticeComponent.prototype.closeMask2 = function () {
        $('.mask2').hide();
        $('#prese').val('');
        this.upGroupNotice = {
            'id': '',
            'title': '',
            'notice': '',
            'status': ''
        };
    };
    NoticeComponent.prototype.closeMask3 = function () {
        $('.mask3').hide();
    };
    return NoticeComponent;
}());
NoticeComponent = __decorate([
    core_1.Component({
        selector: 'app-notice',
        templateUrl: './notice.component.html',
        styleUrls: ['./notice.component.css'
        ],
        providers: [group_notice_service_2.GroupNoticeService, util_building_service_1.UtilBuildingService, error_response_service_1.ErrorResponseService]
    })
], NoticeComponent);
exports.NoticeComponent = NoticeComponent;
