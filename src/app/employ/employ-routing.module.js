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
var router_1 = require("@angular/router");
var route_guard_service_1 = require("../service/route-guard/route-guard.service");
var homepage_component_1 = require("./homepage/homepage.component");
var employ_component_1 = require("./employ.component");
var routes = [
    {
        path: '',
        canActivate: [route_guard_service_1.RouteGuardService],
        component: employ_component_1.EmployComponent,
        children: [
            {
                path: "",
                canActivate: [route_guard_service_1.RouteGuardService],
                component: homepage_component_1.HomepageComponent,
                redirectTo: 'group',
                pathMatch: 'full'
            },
            {
                /*员工团购网*/
                path: "group",
                canActivate: [route_guard_service_1.RouteGuardService],
                loadChildren: './group/group.module#GroupModule'
            },
            {
                /*餐饮超市区*/
                path: "",
            }
        ]
    },
];
var EmployRoutingModule = (function () {
    function EmployRoutingModule() {
    }
    return EmployRoutingModule;
}());
EmployRoutingModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            router_1.RouterModule.forChild(routes),
        ],
        exports: [router_1.RouterModule],
        declarations: [employ_component_1.EmployComponent, homepage_component_1.HomepageComponent]
    })
], EmployRoutingModule);
exports.EmployRoutingModule = EmployRoutingModule;
