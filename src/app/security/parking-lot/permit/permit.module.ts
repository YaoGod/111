import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermitComponent } from './permit.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: PermitComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PermitComponent]
})

export class PermitModule { }
