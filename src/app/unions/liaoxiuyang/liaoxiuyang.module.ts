import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiaoxiuyangComponent } from './liaoxiuyang.component';
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {TurnBarModule} from "../../component/turn-bar/turn-bar.module";
import { LiaoxiuyangLineComponent } from './liaoxiuyang-line/liaoxiuyang-line.component';
import { LiaoxiuyangBatchComponent } from './liaoxiuyang-batch/liaoxiuyang-batch.component';
import { LiaoxiuyangGroupComponent } from './liaoxiuyang-group/liaoxiuyang-group.component';
import { LiaoxiuyangSignComponent } from './liaoxiuyang-sign/liaoxiuyang-sign.component';
import { LiaoxiuyangApproveComponent } from './liaoxiuyang-approve/liaoxiuyang-approve.component';
import {LiaoxiuyangConditionComponent} from "./liaoxiuyang-condition/liaoxiuyang-condition.component";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: LiaoxiuyangComponent,
    children: [
      {
        path: '',
        redirectTo: 'line',
        pathMatch: 'full'
      },
      {
        path: 'line',
        component: LiaoxiuyangLineComponent
      },
      {
        path: 'batch',
        component: LiaoxiuyangBatchComponent
      },
      {
        path: 'group',
        component: LiaoxiuyangGroupComponent
      },
      {
        path: 'sign',
        component: LiaoxiuyangSignComponent
      },
      {
        path: 'approve',
        component: LiaoxiuyangApproveComponent
      },
      {
        path: 'condition',
        component: LiaoxiuyangConditionComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TurnBarModule,
    RouterModule.forChild(routes),
  ],
  declarations: [LiaoxiuyangComponent, LiaoxiuyangLineComponent, LiaoxiuyangBatchComponent,
    LiaoxiuyangGroupComponent, LiaoxiuyangSignComponent, LiaoxiuyangApproveComponent, LiaoxiuyangConditionComponent]
})
export class LiaoxiuyangModule { }
