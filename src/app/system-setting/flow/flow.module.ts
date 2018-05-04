import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowComponent } from './flow.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
import { GroupConfigComponent } from './group-config/group-config.component';
import { FlowConfigComponent } from './flow-config/flow-config.component';
import { JobMangComponent } from './job-mang/job-mang.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: FlowComponent,
    children: [
      {
        path: 'groupConfig',
        component: GroupConfigComponent,
      },
      {
        path: 'flowConfig',
        component: FlowConfigComponent,
      },
      {
        path: 'jobMang',
        component: JobMangComponent,
      }
    ]
  }
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [RouteGuardService],
  declarations: [FlowComponent, GroupConfigComponent, FlowConfigComponent, JobMangComponent]
})
export class FlowModule { }
