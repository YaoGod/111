import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowComponent } from './flow.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../service/route-guard/route-guard.service";

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: FlowComponent,
  }
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [RouteGuardService],
  declarations: [FlowComponent]
})
export class FlowModule { }
