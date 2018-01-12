import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceComponent } from './workspace.component';
import { RouteGuardService } from '../../service/route-guard/route-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { OrderhandComponent } from './orderhand/orderhand.component';
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
  declarations: [WorkspaceComponent, OrderhandComponent]
})
export class WorkspaceModule { }
