import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ReclaimComponent} from "./reclaim.component";
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";


const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: ReclaimComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReclaimComponent]
})
export class ReclaimModule { }
