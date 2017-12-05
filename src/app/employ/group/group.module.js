"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var homepage_component_1 = require("./homepage/homepage.component");
var router_1 = require("@angular/router");
var product_component_1 = require("./product/product.component");
var global_footer_module_1 = require("../../security/basic-info/global-footer/global-footer.module");
var order_component_1 = require("./order/order.component");
var groupbuy_component_1 = require("./groupbuy/groupbuy.component");
var notice_component_1 = require("./notice/notice.component");
var forms_1 = require("@angular/forms");
var cart_component_1 = require("./cart/cart.component");
var group_component_1 = require("./group.component");
var routes = [
    { path: '',
        component: group_component_1.GroupComponent,
        children: [
            {
                path: '',
                component: homepage_component_1.HomepageComponent
            },
            {
                /*团购商品管理*/
                path: 'product',
                component: product_component_1.ProductComponent
            },
            {
                path: 'order',
                component: order_component_1.OrderComponent
            },
            {
                path: 'groupbuy',
                component: groupbuy_component_1.GroupbuyComponent
            },
            {
                path: 'notice',
                component: notice_component_1.NoticeComponent
            },
            {
                path: 'cart',
                component: cart_component_1.CartComponent
            }
        ]
    }
];
var GroupModule = (function () {
    function GroupModule() {
    }
    return GroupModule;
}());
GroupModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            global_footer_module_1.GlobalFooterModule,
            router_1.RouterModule.forChild(routes)
        ],
        exports: [router_1.RouterModule],
        declarations: [homepage_component_1.HomepageComponent, product_component_1.ProductComponent, order_component_1.OrderComponent, groupbuy_component_1.GroupbuyComponent, notice_component_1.NoticeComponent, cart_component_1.CartComponent, group_component_1.GroupComponent]
    })
], GroupModule);
exports.GroupModule = GroupModule;
