import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
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
import {UserPortalService} from "../service/user-portal/user-portal.service";
import { RoleComponent } from './role/role.component';
import { AbilityComponent } from './ability/ability.component';
import { JoinRoleComponent } from './join-role/join-role.component';
import { JoinAbilityComponent } from './join-ability/join-ability.component';
import { PersonComponent } from './person/person.component';
import {ExamineDetailComponent} from "./examine-detail/examine-detail.component";
import {ExamineComponent} from "./examine/examine.component";
import { ExamineMyComponent } from './examine-my/examine-my.component';
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
        /*用户配角色*/
        path: 'joinRole/:id',
        component: JoinRoleComponent
      },
      {
        /*角色管理*/
        path: 'role',
        component: RoleComponent
      },
      {
        /*角色配权限*/
        path: 'joinAbility/:id',
        component: JoinAbilityComponent
      },
      {
        /*权限管理*/
        path: 'ability',
        component: AbilityComponent
      },
      {
        /*系统日志管理*/
        path: 'logger',
        component: LoggerComponent
      },
      {
        /*系统日志管理*/
        path: 'person',
        component: PersonComponent
      },
      {
        /*工作流配置*/
        path: 'flow',
        loadChildren:  './flow/flow.module#FlowModule'
      },
      {
        /*工单管理*/
        path: 'examine',
        component:ExamineComponent
      },
      {
        /*我的工单*/
        path: 'myExamine',
        component:ExamineMyComponent
      },
      {
        /*工单审核*/
        path: 'check/:id',
        component:ExamineDetailComponent
      },
      {
        /*工单详情*/
        path: 'detail/:id',
        component:ExamineDetailComponent
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
  providers: [RouteGuardService, UserPortalService],
  declarations: [SystemSettingComponent, LoggerComponent, UserComponent, RoleComponent,
    AbilityComponent, ExamineMyComponent, JoinRoleComponent, JoinAbilityComponent,
    PersonComponent, ExamineComponent,ExamineDetailComponent,]
})
export class SystemSettingModule { }
