import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../service/route-guard/route-guard.service';
import {GlobalFooterModule} from "../component/global-footer/global-footer.module";
import {TurnBarModule} from "../component/turn-bar/turn-bar.module";
import {ImgurlModule} from "../pipe/imgurl/imgurl.module";
import {HttpModule} from "@angular/http";
import {NavTitleModule} from "../component/nav-title/nav-title.module";
import { SystemSettingComponent } from './system-setting.component';
import { LoggerComponent } from './logger/logger.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: SystemSettingComponent,
    children: [
      /*{
       path: '',
       redirectTo: 'share',
       pathMatch: 'full'
       },*/
      {
        /*用户管理*/
        path: 'user',
        component: UserComponent
      },
      {
        /*系统日志管理*/
        path: 'logger',
        component: LoggerComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    NavTitleModule,
    GlobalFooterModule,
    TurnBarModule,
    ImgurlModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [RouteGuardService],
  declarations: [SystemSettingComponent, LoggerComponent, UserComponent]
})
export class SystemSettingModule { }
