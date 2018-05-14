import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntrySecurityComponent } from './entry-security.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {NavTitleModule} from "../../component/nav-title/nav-title.module";
import {GlobalFooterModule} from "../../component/global-footer/global-footer.module";
import {TurnBarModule} from "../../component/turn-bar/turn-bar.module";
import {ImgurlModule} from "../../pipe/imgurl/imgurl.module";
import { EntrySecurityHomepageComponent } from './entry-security-homepage/entry-security-homepage.component';
import { LaunchedComponent } from './launched/launched.component';
import { ExamineComponent } from './examine/examine.component';
import { ExamineDetailComponent } from './examine-detail/examine-detail.component';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: EntrySecurityComponent,
    children: [
      {
        /*出入安全首页*/
        path: '',
        component:EntrySecurityHomepageComponent
      },
      {
        /*我审核的*/
        path: 'examine',
        component:ExamineComponent
      },
      {
        /*我发起的*/
        path: 'launched',
        component:LaunchedComponent
      },
      {
        /*工单详情*/
        path: 'detail/:id',
        component:ExamineDetailComponent
      },
      {
        /*工单审核*/
        path: 'check/:id',
        component:ExamineDetailComponent
      },
      {
        /*工号牌申请模块*/
        path:'workCard',
        loadChildren: './entry-security-work-card/entry-security-work-card.module#EntrySecurityWorkCardModule'
      },
      {
        /*门禁申请模块*/
        path:'door',
        loadChildren: './entry-security-door/entry-security-door.module#EntrySecurityDoorModule'
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
  declarations:[EntrySecurityHomepageComponent,EntrySecurityComponent, LaunchedComponent,
    ExamineComponent,ExamineDetailComponent]
})
export class EntrySecurityModule { }
