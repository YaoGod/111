"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var group_product_service_1 = require("../../../service/group-product/group-product.service");
var error_response_service_1 = require("../../../service/error-response/error-response.service");
var GroupbuyComponent = (function () {
    function GroupbuyComponent() {
    }
    GroupbuyComponent.prototype.ngOnInit = function () {
    };
    GroupbuyComponent.prototype.goCart = function () {
    };
    return GroupbuyComponent;
}());
GroupbuyComponent = __decorate([
    core_1.Component({
        selector: 'app-groupbuy',
        templateUrl: './groupbuy.component.html',
        styleUrls: ['./groupbuy.component.css'],
        providers: [group_product_service_1.GroupProductService, error_response_service_1.ErrorResponseService]
    })
], GroupbuyComponent);
exports.GroupbuyComponent = GroupbuyComponent;
