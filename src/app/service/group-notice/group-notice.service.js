"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
var GroupNoticeService = (function () {
    function GroupNoticeService(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.options = new http_1.RequestOptions({
            headers: this.headers,
            withCredentials: true
        });
    }
    ;
    /* 获取公告列表
   
     return:              #公告*/
    GroupNoticeService.prototype.getNoticeList = function (title) {
        if (title == undefined) {
            title == "";
        }
        var url = '/proxy/mmall/notice/getNoticeList/';
        var data = title;
        return this.http.post(url, data, this.options)
            .map(function (res) { return res.json(); });
    };
    /*
     新增公告信息
     param: id:number,     #公告ID
     return:
     */
    GroupNoticeService.prototype.addGroupBuyNotice = function (postData) {
        var url = '/proxy/mmall/notice/addGroupbuyNotice';
        var data = postData;
        return this.http.post(url, data, this.options)
            .map(function (res) { return res.json(); });
    };
    /*
     删除公告信息
     param: id:number,     #大楼ID
     return:
     */
    GroupNoticeService.prototype.deleteGroupbuyNotice = function (id) {
        var url = '/proxy/mmall/notice/deleteGroupbuyNotice/' + id;
        return this.http.get(url, this.options)
            .map(function (res) { return res.json(); });
    };
    GroupNoticeService.prototype.getNotice = function (id) {
        var url = '/proxy/mmall/notice/getNotice/' + id;
        return this.http.get(url, this.options)
            .map(function (res) { return res.json(); });
    };
    /*
     修改公告信息
     param: id:number,     #大楼ID
     return:
     */
    GroupNoticeService.prototype.updateGroupBuyNotice = function (postData) {
        console.log(postData);
        var url = '/proxy/mmall/notice/updateGroupNotice';
        var data = postData;
        return this.http.post(url, data, this.options)
            .map(function (res) { return res.json(); });
    };
    return GroupNoticeService;
}());
GroupNoticeService = __decorate([
    core_1.Injectable()
], GroupNoticeService);
exports.GroupNoticeService = GroupNoticeService;
