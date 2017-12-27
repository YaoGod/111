import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceComponent } from './workspace.component';
import { RouteGuardService } from '../../service/route-guard/route-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { OrderhandComponent } from './orderhand/orderhand.component';
import {ConsumeComponent} from "./consume/consume.component";
import { ServicecenterComponent } from './servicecenter/servicecenter.component';
import {TurnBarModule} from "../../component/turn-bar/turn-bar.module";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: WorkspaceComponent,
    children: [
      {
        path: '',
        redirectTo: 'homepage',
        pathMatch: 'full'
      },
      {
        path: 'homepage',
        loadChildren: './workspace-home/workspace-home.module#WorkspaceHomeModule'
      },
      {
        path: 'consume',
        loadChildren: './consume/consume.module#ConsumeModule'
      }      ,
      {
        path: 'orderhand',
        component: OrderhandComponent,
      },
      {
        path: 'servicecenter',
        component: ServicecenterComponent,
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    TurnBarModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  declarations: [WorkspaceComponent, OrderhandComponent, ServicecenterComponent]
})
export class WorkspaceModule { }
