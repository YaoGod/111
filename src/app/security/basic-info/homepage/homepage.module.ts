import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
import {FormsModule} from "@angular/forms";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: HomepageComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [HomepageComponent]
})
  /*大楼列表页*/
export class HomepageModule { }
