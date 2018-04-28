///<reference path="../../../../../node_modules/@angular/router/src/router_module.d.ts"/>
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntrySecurityWorkCardComponent } from './entry-security-work-card.component';
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {NavTitleModule} from "../../../component/nav-title/nav-title.module";
import {GlobalFooterModule} from "../../../component/global-footer/global-footer.module";
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";
import {ImgurlModule} from "../../../pipe/imgurl/imgurl.module";
import { WorkCardApplyComponent } from './work-card-apply/work-card-apply.component';
import { WorkCardMangComponent } from './work-card-mang/work-card-mang.component';
import { WorkCardOperComponent } from './work-card-oper/work-card-oper.component';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: EntrySecurityWorkCardComponent,
    children: [
      {
        /*工号牌申请页*/
        path: 'apply',
        component:WorkCardApplyComponent
      },
      {
        /*工号牌记录*/
        path: 'manage',
        component:WorkCardMangComponent
      },
      {
        /*工号牌管理*/
        path: 'oper',
        component:WorkCardOperComponent
      },
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
  declarations: [EntrySecurityWorkCardComponent, WorkCardApplyComponent,WorkCardOperComponent,WorkCardMangComponent]
})
export class EntrySecurityWorkCardModule { }
