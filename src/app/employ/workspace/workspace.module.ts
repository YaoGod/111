import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceComponent } from './workspace.component';
import { RouteGuardService } from '../../service/route-guard/route-guard.service';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: WorkspaceComponent,
    children: []
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  declarations: [WorkspaceComponent]
})
export class WorkspaceModule { }
