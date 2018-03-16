import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { RouteGuardService } from '../service/route-guard/route-guard.service';

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
