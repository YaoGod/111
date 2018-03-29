import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule } from '@angular/forms';
import { GroupListComponent } from './group-list.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
import { MinLengthPipe } from './min-length.pipe';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: GroupListComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule,MinLengthPipe],
  declarations: [GroupListComponent, MinLengthPipe]
})
export class GroupListModule { }
