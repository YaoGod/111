import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { RouteGuardService } from '../service/route-guard/route-guard.service';
import {HelpDocComponent} from "./help-doc/help-doc.component";
import { HomepageComponent } from './homepage/homepage.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'hzportal',
    canActivate: [RouteGuardService],
    component: HeaderComponent,
    children: [
      {
        path: '',
        component: HomepageComponent
      },
      {
        /*后勤物业*/
        path: 'security',
        loadChildren: '../security/security.module#SecurityModule'
      },
      {
        /*员工服务*/
        path: 'employ',
        loadChildren: '../employ/employ.module#EmployModule'
      },
      {
        /*公共资源*/
        path: 'publicResource',
        loadChildren: '../public-resource/public-resource.module#PublicResourceModule'
      },
      {
        /*系统管理*/
        path: 'system',
        loadChildren: '../system-setting/system-setting.module#SystemSettingModule'
      },
      {
        /*系统管理*/
        path: 'help',
        component: HelpDocComponent
      },
      {
        /*党建管理*/
        path: 'party',
        loadChildren: '../party-build/party-build.module#PartyBuildModule'
      }

    ]
  },
  {
    path:"demo",
    loadChildren: '../demo/demo.module#DemoModule'
  }

];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [RouteGuardService],
  declarations: []
})
export class HzportalRoutingModule {}
