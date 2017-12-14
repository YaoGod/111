import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceComponent } from './workspace.component';
import { RouteGuardService } from '../../service/route-guard/route-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { OrderhandComponent } from './orderhand/orderhand.component';
import {ConsumeComponent} from "./consume/consume.component";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: WorkspaceComponent,
    children: [
      {
        path: '',
        canActivate: [RouteGuardService],
        redirectTo: 'consume',
        pathMatch: 'full'
      },
      {
        path: 'consume',
        component: ConsumeComponent,
      },
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
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  declarations: [WorkspaceComponent, ConsumeComponent, OrderhandComponent]
})
export class WorkspaceModule { }
