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
var GroupProductService = (function () {
    function GroupProductService(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.options = new http_1.RequestOptions({
            headers: this.headers,
            withCredentials: true
        });
    }
    ;
    /* 获取商品列表
  
     return:              #公告*/
    GroupProductService.prototype.getProductList = function (pageNo, pageSize, search) {
        var url = '/proxy/mmall/group/getProductList/' + pageNo + '/' + pageSize + '?search=';
        var data = search;
        return this.http.post(url, data, this.options)
            .map(function (res) { return res.json(); });
    };
    /*
     新增商品信息
     param: id:number,     #公告ID
     return:
     */
    GroupProductService.prototype.addGroupBuyProduct = function (postData) {
        console.log(postData);
        var url = '/proxy/mmall/group/addGroupbuyProduct';
        var data = postData;
        return this.http.post(url, data, this.options)
            .map(function (res) { return res.json(); });
    };
    /*
     删除公告信息
     param: id:number,     #大楼ID
     return:
     */
    GroupProductService.prototype.deleteGroupbuyProduct = function (code) {
        var url = '/proxy/mmall/group/deleteGroupbuyProduct/' + code;
        return this.http.get(url, this.options)
            .map(function (res) { return res.json(); });
    };
    /*
     查询该code的商品
     param: id:number,     #大楼ID
     return:
     */
    GroupProductService.prototype.getGroupProduct = function (code) {
        var url = '/proxy/mmall/group/getGroupProduct/' + code;
        return this.http.get(url, this.options)
            .map(function (res) { return res.json(); });
    };
    /*
     修改商品信息
     param: id:number,     #大楼ID
     return:
     */
    GroupProductService.prototype.updateGroupbuyProduct = function (postData) {
        console.log(postData);
        var url = '/proxy/mmall/group/updateGroupbuyProduct';
        var data = postData;
        return this.http.post(url, data, this.options)
            .map(function (res) { return res.json(); });
    };
    /*
     图片上传
     param: postData:img,
     return:
     */
    GroupProductService.prototype.uploadImg = function (postData, type, id) {
        var url = '/proxy/mmall/util/uploadImg/' + type + '/' + id;
        var form = new FormData();
        if (typeof (postData) === 'object') {
            form.append('img', postData);
        }
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.withCredentials = true;
        xhr.send(form);
        return xhr;
    };
    return GroupProductService;
}());
GroupProductService = __decorate([
    core_1.Injectable()
], GroupProductService);
exports.GroupProductService = GroupProductService;
