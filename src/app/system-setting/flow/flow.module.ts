import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowComponent } from './flow.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
import { GroupConfigComponent } from './group-config/group-config.component';
import { FlowConfigComponent } from './flow-config/flow-config.component';
import { JobMangComponent } from './job-mang/job-mang.component';
import {FormsModule} from "@angular/forms";

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: FlowComponent,
    children: [
      {
        path: '',
        redirectTo: "groupConfig",
        pathMatch: 'full'
      },
      {
        path: 'groupConfig',
        loadChildren: './group-config/group-config.module#GroupConfigModule'
        // component: GroupConfigComponent,
      },
      {
        path: 'flowConfig',
        component: FlowConfigComponent,
      },
      {
        path: 'jobMang',
        component: JobMangComponent,
      },
      {
        path: 'reclaim',
        // component: ReclaimComponent,
        loadChildren: './reclaim/reclaim.module#ReclaimModule'
      }
    ]
  }
];
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [RouteGuardService],
  declarations: [FlowComponent, FlowConfigComponent, JobMangComponent]
})
export class FlowModule { }
