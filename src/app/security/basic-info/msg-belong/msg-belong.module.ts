import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MsgBelongComponent } from './msg-belong.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: MsgBelongComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [MsgBelongComponent]
})
export class MsgBelongModule { }
