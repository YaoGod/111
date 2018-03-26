import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../service/route-guard/route-guard.service';
import { HomepageComponent } from './homepage/homepage.component';
import { EmployComponent } from './employ.component';
import { NavTitleModule } from '../component/nav-title/nav-title.module';
import { GlobalFooterModule } from '../component/global-footer/global-footer.module';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component:EmployComponent,
    children: [
      {
        path: "",
        canActivate: [RouteGuardService],
        component: HomepageComponent,
        redirectTo: 'group',
        pathMatch: 'full'
      },
      {
        /*员工团购网*/
        path: "group",
        canActivate: [RouteGuardService],
        loadChildren: './group/group.module#GroupModule'
      },
      {
        /*餐饮超市区*/
        path: "market",
        canActivate: [RouteGuardService],
        loadChildren: './market/market.module#MarketModule'
      },
      {
        /*后勤服务区*/
        path: "logistics",
        canActivate: [RouteGuardService],
        loadChildren: './logistics/logistics.module#LogisticsModule'
      },
      {
        /*福利专区*/
        path: "welfare",
        canActivate: [RouteGuardService],
        loadChildren: './welfare/welfare.module#WelfareModule'
      },
      {
        /*共享专区*/
        path: 'share',
        loadChildren: './share/share.module#ShareModule'
      },
      {
        /*我的工作台*/
        path: "workspace",
        canActivate: [RouteGuardService],
        loadChildren: './workspace/workspace.module#WorkspaceModule'
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    NavTitleModule,
    GlobalFooterModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  declarations: [EmployComponent,HomepageComponent]
})
export class EmployRoutingModule { }
