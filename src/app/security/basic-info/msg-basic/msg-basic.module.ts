import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MsgBasicComponent } from './msg-basic.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: MsgBasicComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [MsgBasicComponent]
})
export class MsgBasicModule { }
