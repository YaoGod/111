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
var UtilBuildingService = (function () {
    function UtilBuildingService(http) {
        this.http = http;
        this.headers = new http_1.Headers();
        this.options = new http_1.RequestOptions({
            headers: this.headers,
            withCredentials: true,
        });
    }
    /*
     图片上传
     param: postData:file,
     return:
     */
    UtilBuildingService.prototype.uploadImg = function (postData, type, id) {
        var url = '/proxy/building/util/uploadImg/' + type + '/' + id;
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
    /*
     文件上传
     param: postData:file,
     return:
     */
    UtilBuildingService.prototype.uploadFile = function (postData, type, id) {
        var url = '/proxy/building/util/uploadFile/' + type + '/' + id;
        var form = new FormData();
        if (typeof (postData) === 'object') {
            form.append('file', postData);
        }
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.withCredentials = true;
        xhr.send(form);
        return xhr;
    };
    /*
     文件上传
     param: postData:file,
     return:
     */
    UtilBuildingService.prototype.importTemplate = function (postData) {
        var url = '/proxy/building/energy/importTemplate/';
        var form = new FormData();
        if (typeof (postData) === 'object') {
            form.append('file', postData);
        }
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.withCredentials = true;
        xhr.send(form);
        return xhr;
    };
    return UtilBuildingService;
}());
UtilBuildingService = __decorate([
    core_1.Injectable()
], UtilBuildingService);
exports.UtilBuildingService = UtilBuildingService;
