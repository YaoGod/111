///<reference path="../../../../../node_modules/@angular/router/src/router_module.d.ts"/>
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";
import {RouterModule, Routes} from "@angular/router";
import {ImgurlModule} from "../../../pipe/imgurl/imgurl.module";
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";
import {GlobalFooterModule} from "../../../component/global-footer/global-footer.module";
import {NavTitleModule} from "../../../component/nav-title/nav-title.module";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {EntrySecurityDoorComponent} from "./entry-security-door.component";
import { DoorApplyComponent } from './door-apply/door-apply.component';
import { DoorMangComponent } from './door-mang/door-mang.component';
import { DoorMangLoggerComponent } from './door-mang-logger/door-mang-logger.component';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: EntrySecurityDoorComponent,
    children: [
      {
        /*门禁权限变更申请单*/
        path: 'apply',
        component:DoorApplyComponent
      },
      {
        /*门禁系统权限*/
        path: 'manage',
        component:DoorMangComponent
      },
      {
        /*权限变更日志*/
        path: 'logger',
        component:DoorMangLoggerComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    NavTitleModule,
    GlobalFooterModule,
    TurnBarModule,
    ImgurlModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [RouteGuardService],
  declarations: [EntrySecurityDoorComponent, DoorApplyComponent, DoorMangComponent, DoorMangLoggerComponent]
})
export class EntrySecurityDoorModule { }
