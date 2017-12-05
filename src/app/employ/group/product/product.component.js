"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var group_product_service_1 = require("../../../mode/groupProduct/group-product.service");
var group_product_service_2 = require("../../../service/group-product/group-product.service");
var error_response_service_1 = require("../../../service/error-response/error-response.service");
var $ = require("jquery");
var util_building_service_1 = require("../../../service/util-building/util-building.service");
var ProductComponent = (function () {
    function ProductComponent(groupProductService, errorVoid) {
        this.groupProductService = groupProductService;
        this.errorVoid = errorVoid;
        this.pageNo = 1;
        /*当前页码*/
        this.pageSize = 6;
        this.upGroupProduct = {
            code: '',
            name: '',
            image: '',
            detail: '',
            price: '',
            status: '',
            startTime: '',
            endTime: '',
            contact: '',
            phone: '',
            payaccount: '',
            label: '',
            producttype: ''
        };
        this.newGroupProduct = {
            name: '',
            image: '',
            detail: '',
            price: '',
            status: '',
            startTime: '',
            endTime: '',
            contact: '',
            phone: '',
            payaccount: '',
            label: '',
            producttype: ''
        };
    }
    ProductComponent.prototype.ngOnInit = function () {
        this.search = new group_product_service_1.GroupProduct();
        this.getProductList();
    };
    ProductComponent.prototype.getProductList = function () {
        var _this = this;
        this.groupProductService.getProductList(this.pageNo, this.pageSize, this.search).subscribe(function (data) {
            if (_this.errorVoid.errorMsg(data.status)) {
                _this.groupProducts = data.data.infos;
            }
        });
    };
    ProductComponent.prototype.fadeBom = function () {
        $('.mask').show();
    };
    ProductComponent.prototype.closeMask = function () {
        $('.mask').hide();
        $('#prese').val('');
        this.newGroupProduct = {
            name: '',
            image: '',
            detail: '',
            price: '',
            status: '',
            startTime: '',
            endTime: '',
            contact: '',
            phone: '',
            payaccount: '',
            label: '',
            producttype: ''
        };
    };
    /*维修记录校验规则*/
    ProductComponent.prototype.verifyImage = function () {
        if (!this.isEmpty('image', '商品图片不能为空')) {
            return false;
        }
        return true;
    };
    ProductComponent.prototype.verifyName = function () {
        if (!this.isEmpty('name', '商品名称不能为空')) {
            return false;
        }
        return true;
    };
    ProductComponent.prototype.verifyProductPrice = function () {
        if (!this.isEmpty('price', '费用不能为空')) {
            return false;
        }
        if (!this.verifyIsNumber('price', '请输入正确的费用')) {
            return false;
        }
        return true;
    };
    ProductComponent.prototype.verifyStatus = function () {
        if (!this.isEmpty('status', '商品标签不能为空')) {
            return false;
        }
        return true;
    };
    ProductComponent.prototype.verifyBtime = function () {
        if (!this.isEmpty('startTime', '时间不能为空')) {
            return false;
        }
        return true;
    };
    ProductComponent.prototype.verifyEtime = function () {
        if (!this.isEmpty('endTime', '时间不能为空')) {
            return false;
        }
        return true;
    };
    ProductComponent.prototype.verifyContact = function () {
        if (!this.isEmpty('contact', '团购联系人不能为空')) {
            return false;
        }
        return true;
    };
    ProductComponent.prototype.verifyPhone = function () {
        if (!this.isEmpty('phone', '联系电话不能为空')) {
            return false;
        }
        if (!this.verifyIsTel('phone', '请输入正确的手机号')) {
            return false;
        }
        return true;
    };
    ProductComponent.prototype.verifyPayaccount = function () {
        if (!this.isEmpty('payaccount', '收款账号不能为空')) {
            return false;
        }
        return true;
    };
    ProductComponent.prototype.verifyDetail = function () {
        if (!this.isEmpty('detail', '商品详情不能为空')) {
            return false;
        }
        return true;
    };
    /**非空校验*/
    ProductComponent.prototype.isEmpty = function (id, error) {
        var data = $('#' + id).val();
        if (data.toString().trim() === '') {
            this.addErrorClass(id, error);
            return false;
        }
        else {
            this.removeErrorClass(id);
            return true;
        }
    };
    /**
     * 验证手机号码
     * @return
     */
    ProductComponent.prototype.verifyIsTel = function (id, error) {
        var data = $('#' + id).val(); /*/^1(3[4-9]|5[0-2]|8[0-3,78])\d{8}$/ 移动号段*/
        if (!String(data).match(/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/)) {
            this.addErrorClass(id, '请填写正确手机号');
            return false;
        }
        else {
            this.removeErrorClass(id);
            return true;
        }
    };
    /**
     * 匹配数字
     * @param id
     * @param error
     * @returns {boolean}
     */
    ProductComponent.prototype.verifyIsNumber = function (id, error) {
        var data = $('#' + id).val(); // /^[0-9]*$/
        if (!String(data).match(/^[0-9]*$/)) {
            this.addErrorClass(id, error);
            return false;
        }
        else {
            this.removeErrorClass(id);
            return true;
        }
    };
    /**
     * 添加错误信息class
     * @param id
     * @param error
     */
    ProductComponent.prototype.addErrorClass = function (id, error) {
        $('#' + id).parents('.form-control').addClass('form-error');
        if (error === undefined || error.trim().length === 0) {
            $('#' + id).next('span').html('输入错误');
        }
        else {
            $('#' + id).next('span').html(error);
        }
    };
    /**
     * 去除错误信息class
     * @param id
     */
    ProductComponent.prototype.removeErrorClass = function (id) {
        $('#' + id).parents('.form-control').removeClass('form-error');
        $('#' + id).parents('.form-control').children('.form-inp').children('.errorMessage').html('');
    };
    ProductComponent.prototype.subGroupProduct = function () {
        var _this = this;
        if (this.newGroupProduct.image == '' || this.newGroupProduct.name == '' || this.newGroupProduct.price == '' || this.newGroupProduct.status == '' || this.newGroupProduct.startTime == '' ||
            this.newGroupProduct.endTime == '' || this.newGroupProduct.contact == '' || this.newGroupProduct.phone == '' || this.newGroupProduct.payaccount || this.newGroupProduct.detail == '') {
            alert("请把信息填写完整");
            return false;
        }
        this.groupProductService.addGroupBuyProduct(this.newGroupProduct)
            .subscribe(function (data) {
            if (data['status'] === 0) {
                alert("新增成功");
                /* confirmFunc.init({
                 'title': '提示' ,
                 'mes': '新增成功',
                 });*/
                _this.closeMask();
                _this.getProductList();
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
    ProductComponent.prototype.okFunc = function () {
        var _this = this;
        $('.confirm').hide();
        this.groupProductService.deleteGroupbuyProduct(this.code)
            .subscribe(function (data) {
            if (_this.errorVoid.errorMsg(data.status)) {
                alert("删除成功");
            }
            _this.getProductList();
        });
    };
    ProductComponent.prototype.noFunc = function () {
        $('.confirm').fadeOut();
    };
    ProductComponent.prototype.delete = function (code) {
        /*let d = confirm("是否删除该大楼");
         if(d){
    
         }*/
        this.code = code;
        $('.confirm').fadeIn();
    };
    ProductComponent.prototype.update = function (code) {
        var _this = this;
        this.groupProductService.getGroupProduct(code)
            .subscribe(function (data) {
            if (data['status'] == 0) {
                //this.updateNotice = data.data;
                console.log(data.data);
                _this.upGroupProduct.image = data.data.image;
                _this.upGroupProduct.code = data.data.code;
                _this.upGroupProduct.name = data.data.name;
                _this.upGroupProduct.price = data.data.price;
                _this.upGroupProduct.detail = data.data.detail;
                _this.upGroupProduct.startTime = data.data.startTime;
                _this.upGroupProduct.endTime = data.data.endTime;
                _this.upGroupProduct.contact = data.data.contact;
                _this.upGroupProduct.phone = data.data.phone;
            }
            $('.mask2').show();
        });
    };
    ProductComponent.prototype.updateGroupProduct = function () {
        var _this = this;
        if (!this.verifyImage() || !this.verifyName() || !this.verifyProductPrice() || !this.verifyStatus() || !this.verifyBtime() ||
            !this.verifyEtime() || !this.verifyContact() || !this.verifyPhone() || !this.verifyPayaccount() ||
            !this.verifyDetail()) {
            alert("请把信息填完整");
            return false;
        }
        this.groupProductService.updateGroupbuyProduct(this.upGroupProduct)
            .subscribe(function (data) {
            console.log(data);
            if (data['status'] === 0) {
                alert("修改成功");
                /* confirmFunc.init({
                 'title': '提示' ,
                 'mes': '新增成功',
                 });*/
                _this.closeMask2();
                _this.getProductList();
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
    ProductComponent.prototype.view = function (code) {
        var _this = this;
        this.groupProductService.getGroupProduct(code)
            .subscribe(function (data) {
            if (data['status'] == 0) {
                _this.upGroupProduct = data.data;
            }
            $('.mask3').show();
        });
    };
    ProductComponent.prototype.closeMask2 = function () {
        $('.mask2').hide();
        $('#prese').val('');
        this.upGroupProduct = {
            code: '',
            name: '',
            image: '',
            detail: '',
            price: '',
            status: '',
            startTime: '',
            endTime: '',
            contact: '',
            phone: '',
            payaccount: '',
            label: '',
            producttype: ''
        };
    };
    ProductComponent.prototype.closeMask3 = function () {
        $('.mask3').hide();
    };
    /*文件图片上传*/
    ProductComponent.prototype.prese_upload = function (files, index) {
        var _this = this;
        var xhr = this.groupProductService.uploadImg(files[0], 'group', -2);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
                var data = JSON.parse(xhr.responseText);
                if (_this.errorVoid.errorMsg(data.status)) {
                    _this.newGroupProduct.image = data.msg;
                    alert("上传成功");
                }
            }
        };
    };
    /*修改文件图片上传*/
    ProductComponent.prototype.prese_upload2 = function (files, index) {
        var _this = this;
        var xhr = this.groupProductService.uploadImg(files[0], 'group', -2);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
                var data = JSON.parse(xhr.responseText);
                if (_this.errorVoid.errorMsg(data.status)) {
                    _this.upGroupProduct.image = data.msg;
                    alert("上传成功");
                }
            }
        };
    };
    return ProductComponent;
}());
ProductComponent = __decorate([
    core_1.Component({
        selector: 'app-product',
        templateUrl: './product.component.html',
        styleUrls: ['./product.component.css'],
        providers: [group_product_service_2.GroupProductService, util_building_service_1.UtilBuildingService, error_response_service_1.ErrorResponseService]
    })
], ProductComponent);
exports.ProductComponent = ProductComponent;
