import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CleanComponent } from './clean.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
import {FormsModule} from "@angular/forms";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: CleanComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [CleanComponent]
})
 /*保洁与绿化管理*/
export class CleanModule { }
