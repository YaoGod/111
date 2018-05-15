import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowComponent } from './flow.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
import { GroupConfigComponent } from './group-config/group-config.component';
import { FlowConfigComponent } from './flow-config/flow-config.component';
import {FormsModule} from "@angular/forms";
import { ReclaimDetailComponent } from './reclaim/reclaim-detail/reclaim-detail.component';
import {TurnBarModule} from "../../component/turn-bar/turn-bar.module";

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
      },
      {
        path: 'flowConfig',
        component: FlowConfigComponent,
      },
      {
        path: 'reclaim',
        // component: ReclaimComponent,
        loadChildren: './reclaim/reclaim.module#ReclaimModule'
      },
      {
        /*人员群组回收详情*/
        path: 'reclaim/detail/:id',
        component:ReclaimDetailComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    TurnBarModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [RouteGuardService],
  declarations: [FlowComponent, FlowConfigComponent, ReclaimDetailComponent]
})
export class FlowModule { }
